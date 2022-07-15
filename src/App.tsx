import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Toolbar,
} from "@mui/material";
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
    console.log(userAnswer);
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
        result.push(table.get(tile)?.실표기);
      }
    }
    return result.reverse();
  };

  const makeProbSelect = () => {
    let selects = [];
    for (let i = 1; i <= db.length; ++i) {
      selects.push(
        <MenuItem key={"op" + i} value={i - 1}>
          {i}
        </MenuItem>
      );
    }

    return selects;
  };

  const selectProblem = (event: SelectChangeEvent) => {
    setAnswerState(false);
    answerRef.current!.value = "";
    setProbNum(parseInt(event.target.value));
  };

  const selectRandomProblem = () => {
    const randomIntFromInterval = (min: number, max: number) => {
      // min and max included
      return Math.floor(Math.random() * (max - min + 1) + min);
    };
    setAnswerState(false);
    answerRef.current!.value = "";
    setProbNum(randomIntFromInterval(0, db.length - 1));
  };

  const makeCorrect = () => {
    setAnswerState(true);
  };

  let comments = [];
  for (let i = 1; i <= 10; ++i) {
    const comm = nanikiru.get("해설" + i);
    if (!!comm) {
      comments.push(comm);
    }
  }

  let callArray = [];
  for (let i = 1; i <= 4; ++i) {
    const call = nanikiru.get(`${i}나키`);
    if (call != null) {
      const callTileArr = translateTileString(call as string);
      const callTile = callTileArr.join("");
      callArray.push(callTile);
    }
  }
  const callList = callArray.join();

  return (
    <>
      <Toolbar>우자쿠식 나니키루 301</Toolbar>
      <TableContainer>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>
                <FormControl sx={{ minWidth: 75 }} size="small">
                  <InputLabel id="demo-simple-select-label">
                    문제번호
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    onChange={selectProblem}
                    value={probNum.toString()}
                    label="문제번호"
                    autoWidth
                  >
                    {makeProbSelect()}
                  </Select>
                </FormControl>
              </TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  key={"randomButton"}
                  onClick={selectRandomProblem}
                >
                  랜덤 문제
                </Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>문제 {nanikiru.get("문제번호")}:</TableCell>
              <TableCell>{nanikiru.get("조건")}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>도라 표시패:</TableCell>
              <TableCell>
                {translateTileString(nanikiru.get("도라표지") as string)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>손패:</TableCell>
              <TableCell>
                {translateTileString(nanikiru.get("패") as string)} &ensp;
                {translateTileString(nanikiru.get("쯔모") as string)}
                <br />[{callList}]
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>입력값:</TableCell>
              <TableCell>
                <Grid container spacing={1} alignItems="center">
                  <Grid item>
                    <TextField
                      sx={{ maxWidth: 140 }}
                      size="small"
                      title="입력"
                      id="answer"
                      label="정답 입력"
                      helperText="ex) 7삭, 5만리치, 중"
                      variant="outlined"
                      name="answer"
                      defaultValue={""}
                      inputRef={answerRef}
                    />
                  </Grid>
                  <Grid item>
                    <Button variant="contained" onClick={checkAnswer}>
                      제출
                    </Button>
                  </Grid>
                </Grid>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>정답:</TableCell>
              <TableCell>
                <Grid container spacing={1} alignItems="center">
                  <Grid item>
                    {answerState &&
                      nanikiru.get("정답1") +
                        " " +
                        (nanikiru.get("정답2") || "")}
                  </Grid>
                  <Grid item>
                    <Button variant="contained" onClick={makeCorrect}>
                      정답확인
                    </Button>
                  </Grid>
                </Grid>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>유효패:</TableCell>
              <TableCell>{answerState && nanikiru.get("유효패")}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>해설:</TableCell>
              <TableCell>
                {answerState &&
                  comments.map((val, idx) => {
                    return (
                      <span key={val + idx.toString()}>
                        {val}
                        <br />
                      </span>
                    );
                  })}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default App;
