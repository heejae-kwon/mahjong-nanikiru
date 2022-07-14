import React, { useRef, useState } from "react";
import nanikiru301 from "./data/nanikiru301.json";

const table = new Map(Object.entries(nanikiru301.TABLE));
const db = nanikiru301.DB;

function App() {
  const answerRef = useRef<HTMLInputElement>(null);
  const [answerState, setAnswerState] = useState(false);
  const [probNum, setProbNum] = useState(0);

  const nanikiru = new Map(Object.entries(db[probNum]));

  const checkAnswer = () => {
    let userAnswer = answerRef.current?.value as string;
    userAnswer = userAnswer.replace(/ +/g, "");
    let correctAnswer =
      (nanikiru.get("정답1") as string) + (nanikiru.get("정답2") || "");
    correctAnswer = correctAnswer.replace(/ +/g, "");
    setAnswerState(userAnswer === correctAnswer);
  };

  const translateTileString = (tileStr: string) => {
    let tilePattern = "";
    let result = [];
    const patternSet = new Set(["m", "s", "p"]);
    for (let i = tileStr.length - 1; i >= 0; --i) {
      if (patternSet.has(tileStr[i])) {
        tilePattern = tileStr[i];
      } else {
        const tile = tileStr[i] + tilePattern;
        result.push(<span key={tile + i}>{table.get(tile)?.실표기}</span>);
      }
    }
    return result.reverse();
  };

  const makeProbSelect = () => {
    let selects = [];
    for (let i = 1; i <= db.length; ++i) {
      selects.push(
        <option key={"op" + i} value={i - 1}>
          {i}
        </option>
      );
    }

    return selects;
  };

  const selectProblem = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setProbNum(parseInt(event.target.value));
  };

  const selectRandomProblem = () => {
    const randomIntFromInterval = (min: number, max: number) => {
      // min and max included
      return Math.floor(Math.random() * (max - min + 1) + min);
    };
    setProbNum(randomIntFromInterval(0, db.length - 1));
  };

  let comments = [];
  for (let i = 1; i <= 10; ++i) {
    const comm = nanikiru.get("해설" + i);
    if (!!comm) {
      comments.push(comm);
    }
  }

  return (
    <div>
      <table>
        <tbody>
          <tr>
            <td>
              <select onChange={selectProblem} value={probNum}>
                {makeProbSelect()}
              </select>
            </td>
            <td>
              <button
                type="button"
                key={"randomButton"}
                onClick={selectRandomProblem}
              >
                랜덤 문제
              </button>
            </td>
          </tr>
          <tr>
            <td>문제 {nanikiru.get("문제번호")}: </td>
            <td>{nanikiru.get("조건")}</td>
          </tr>
          <tr>
            <td>도라 표시패: </td>
            <td>
              <p>{translateTileString(nanikiru.get("도라표지") as string)}</p>
            </td>
          </tr>
          <tr>
            <td>손패: </td>
            <td>
              <p>
                {translateTileString(nanikiru.get("패") as string)} &ensp;
                {translateTileString(nanikiru.get("쯔모") as string)}
              </p>
            </td>
          </tr>
          <tr>
            <td>입력값: </td>
            <td>
              <div>
                <input
                  type="text"
                  title="입력"
                  id="answer"
                  name="answer"
                  defaultValue={""}
                  ref={answerRef}
                />
                <button type="button" onClick={checkAnswer}>
                  제출
                </button>
              </div>
            </td>
          </tr>
          <tr>
            <td>정답: </td>
            <td>
              {answerState &&
                nanikiru.get("정답1") + " " + (nanikiru.get("정답2") || "")}
            </td>
          </tr>
          <tr>
            <td>유효패: </td>
            <td>{answerState && nanikiru.get("유효패")}</td>
          </tr>
          <tr>
            <td>해설: </td>
            <td>
              <p>
                {answerState &&
                  comments.map((val, idx) => {
                    return (
                      <span key={(val as string) + idx}>
                        {val}
                        <br />
                      </span>
                    );
                  })}
              </p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default App;
