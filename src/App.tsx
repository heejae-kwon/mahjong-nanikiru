import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Button,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Toolbar,
} from "@mui/material";
import BackIcon from '@mui/icons-material/ArrowCircleLeft';
import ForwardIcon from '@mui/icons-material/ArrowCircleRight';
import RandomIcon from '@mui/icons-material/QuestionMark';
import { useState } from "react";
import nanikiru301 from "./data/nanikiru301.json";

const table = new Map(Object.entries(nanikiru301.TABLE));
const db = nanikiru301.DB;

function App() {
  //const answerRef = useRef<HTMLInputElement>(null);
  const [answerState, setAnswerState] = useState(false);
  const [probNum, setProbNum] = useState(0);

  const nanikiru = new Map(Object.entries(db[probNum]));


  const translateTileString = (tileStr: string) => {
    let tilePattern = "";
    let result: string[] = [];
    const patternSet = new Set(["m", "s", "p"]);
    for (let i = tileStr.length - 1; i >= 0; --i) {
      if (patternSet.has(tileStr[i])) {
        tilePattern = tileStr[i];
      } else {
        const tile = tileStr[i] + tilePattern;
        result.push((table.get(tile)?.실표기) as string);
      }
    }
    return result.reverse().join('');
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

  const updateProblem = (number: number) => {
    setAnswerState(false);
    //answerRef.current!.value = "";
    number = number == -1 ? db.length - 1 : number
    number = number > db.length - 1 ? 0 : number
    setProbNum(Math.floor(number));
  }
  const selectProblem = (event: SelectChangeEvent) => {
    updateProblem(parseInt(event.target.value));
  };

  const selectRandomProblem = () => {
    const randomIntFromInterval = (min: number, max: number) => {
      // min and max included
      return Math.floor(Math.random() * (max - min + 1) + min);
    };
    updateProblem(randomIntFromInterval(0, db.length - 1));
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
      const callTile = translateTileString(call as string);
      callArray.push(callTile);
    }
  }
  const callList = callArray.join();

  return (
    <Box paddingBottom='48px'>
      <Toolbar>
        <Grid container flexDirection={'row'} alignItems='center' justifyContent='space-between'>
          <Grid item>
            우자쿠식 나니키루 301
          </Grid>
          <Grid item>
            <FormControl size="small">
              <InputLabel id="demo-simple-select-label">
                번호
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

          </Grid>
        </Grid>

      </Toolbar>
      <Divider />
      <TableContainer>
        <Table>
          <TableBody>
            {/**             <TableRow>
              <TableCell>
                <FormControl sx={{ minWidth: 50 }} size="small">
                  <InputLabel id="demo-simple-select-label">
                    번호
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
              <TableCell >
                <Button
                  variant="contained"
                  key={"randomButton"}
                  onClick={selectRandomProblem}
                >
                  랜덤 문제
                </Button>
              </TableCell>
            </TableRow>
*/}
            <TableRow>
              <TableCell variant="head" width='21%'>문제 <br />{nanikiru.get("문제번호")}:</TableCell>
              <TableCell >{nanikiru.get("조건")}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell variant="head">도라
                <br /> 표시패:</TableCell>
              <TableCell >
                {translateTileString(nanikiru.get("도라표지") as string)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell variant="head">손패:</TableCell>
              <TableCell >
                {translateTileString(nanikiru.get("패") as string) + ' '}
                {translateTileString(nanikiru.get("쯔모") as string)}
                <br />[{callList}]
              </TableCell>
            </TableRow>
            {/**            <TableRow>
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
 */}
            <TableRow>
              <TableCell variant="head">정답:</TableCell>
              <TableCell>
                <Grid container flexDirection={'row'} alignItems='center' justifyContent='space-between'>
                  <Grid >
                    {answerState &&
                      nanikiru.get("정답1") +
                      " " +
                      (nanikiru.get("정답2") || "")}
                  </Grid>
                  <Grid >
                    <Button variant="contained" onClick={makeCorrect}>
                      정답확인
                    </Button>
                  </Grid>
                </Grid>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell variant="head">유효패:</TableCell>
              <TableCell >{answerState && nanikiru.get("유효패")}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell variant="head">해설:</TableCell>
              <TableCell>
                {answerState &&
                  comments.map((val, idx) => {
                    return (
                      <span key={val + idx.toString()}>
                        {val + ' '}
                      </span>
                    );
                  })}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
        <BottomNavigation
          showLabels
          onChange={(event, newValue) => {
            switch (newValue) {
              case 0:
                { updateProblem(probNum - 1) }
                break;
              case 1:
                { selectRandomProblem() }
                break;
              case 2:
                { updateProblem(probNum + 1) }
                break;
            }
          }}
        >
          <BottomNavigationAction label="이전문제" icon={<BackIcon />} />
          <BottomNavigationAction label="랜덤문제" icon={<RandomIcon />} />
          <BottomNavigationAction label="다음문제" icon={<ForwardIcon />} />
        </BottomNavigation>
      </Paper>
    </Box>
  );
}

export default App;
