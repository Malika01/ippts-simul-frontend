import { Container } from "@material-ui/core";
import { ThemeProvider } from "@mui/material";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import React, { useEffect, useReducer } from "react";
import {
  ComputationCost,
  ComputationCostMatrix,
  ComputationCostMatrixElem,
  TaskGraphAdjMatrix,
  TaskGraphAdjMatrixElem,
  CommCost,
} from "../types/inittypes";
import { Task } from "../types/basetypes";
import theme from "./theme";
import Table from "./table";
import axios from "axios";
import ReactChart from "./chart";
import * as io from "socket.io-client";
import SimChart from "./simchart";

export const Home: React.FC = () => {
  const [nodes, setNodes] = React.useState(2); //num of nodes
  const [procs, setProcs] = React.useState(2); //num of servers
  const [dis, setDis] = React.useState(false); //sim button disable
  const [out, setOut] = React.useState(false); //display task graph for 'running'
  const [simResp, setSimResp] = React.useState([{ taskId: -1, result: "0" }]); //simulation response array
  const [simRespVal, setSimRespVal] = React.useState(false); //display task graph for 'simulation'
  const [subButton, setSubButton] = React.useState("none"); //button state
  const [downJson, setDownJson] = React.useState(true); //download button disable
  const [progress, setProgress] = React.useState([
    { taskId: -1, result: " ", serverTime: " ", serverId: -1, serverUrl: " " },
  ]); //array for progress tasks
  const scrollTasks = React.useRef(null); //scroll to prog tasks
  var socket: any;
  const [simProgVal, setSimProgVal] = React.useState(false);

  function countReducer(state, action) {
    switch (action) {
      case "increment":
        return state + 1;
      case "decrement":
        return state - 1;
      case "zero":
        return 0;
      case "disconnect":
        return -1;
      default:
        console.log(action);
    }
  }

  const [counter, setCounter] = useReducer(countReducer, 0);

  /*useEffect(() => {
    if (counter > 0) {
      setSimRespVal(true);
    }
    //console.log('simulation array = ', simResp)
  }, [simResp]);*/

  useEffect(() => {
    var object = JSON.parse(sessionStorage.getItem("ippts-output"));
    var len = object.length;
    if (counter > 0) {
        setSimRespVal(true);
    }
    console.log("counter in use effect =", counter);
    if ((counter == -1)) {
        console.log("disconnected")
        //socket.disconnect()
    }
  }, [counter]);

  const downloadFile = () => {
    const element = document.createElement("a");
    const file = new Blob([sessionStorage.getItem("ippts-output")], {
      type: "application/json",
    });
    element.href = URL.createObjectURL(file);
    element.download = "ippts.json";
    element.click();
  };

  const connectSocket = () => {
    var abc = sessionStorage.getItem("ippts-output") as String;
    var object = JSON.parse(sessionStorage.getItem("ippts-output"));
    var len = object.length;
    socket = io.connect(
      "ws://" + import.meta.env.VITE_MASTER_URL + ":5031/sim"
    );

    socket.on("connect", () => {
      socket.emit("data", abc);
      console.log("connected");
    });

    socket.on("simulationprogress", (data) => {
      let received = [
        {
          taskId: data.taskId,
          result: data.result,
          serverTime: data.serverTime,
          serverId: data.serverId,
          serverUrl: data.serverUrl,
        },
      ];
      setProgress((progress) => [...progress, ...received]);
      scrollTasks.current.scrollIntoView(true);
      
        console.log("counter in simulation=", counter)

        if ((counter == -1) && socket != undefined) {
        console.log("disconnected");
            //socket.disconnect();
            //console.log("socket =", socket)
      }
    });

    socket.on("simulationresponse", (data) => {
      let array = [
        {
          taskId: data.taskId,
          result: data.result,
        },
      ];
      setSimResp((simResp) => [...simResp, ...array]);
      try {
        setCounter("increment");
      } catch (error) {
        console.log(error, "response error");
      }
    });
  };

  const sendData = (event) => {
    if (subButton == "run") {
        setOut(false)
        setSimProgVal(false)
        setSimRespVal(false)
    } else if (subButton == "simulate") {
        setSimRespVal(false);
        setSimProgVal(false)
      setSimResp([{ taskId: -1, result: "0" }]);
      setProgress([
        {
          taskId: -1,
          result: " ",
          serverTime: " ",
          serverId: -1,
          serverUrl: " ",
        },
      ]);
      //console.log("simu array at beginning = ", simResp)
      setCounter("zero");
    }

    let adjArr: TaskGraphAdjMatrix = [];
    let compArr: ComputationCostMatrix = [];
    event.preventDefault();
    const data = new FormData(event.target);

    const task = (i: number) => {
      let task: Task = {
        expression: data.get(`expr${i}`) as string,
        taskId: i,
      };
      return task;
    };

    for (let i = 0; i < nodes; i++) {
      let matrixelem: ComputationCostMatrixElem = {
        task: task(i),
        compCosts: [],
      };

      let adjelem: TaskGraphAdjMatrixElem = {
        task: task(i),
        commCosts: [],
      };

      for (let j = 0; j < procs; j++) {
        let compcost: ComputationCost = {
          server: {
            url: "",
            serverId: j,
          },
          cost: Number(data.get(`compcell${i}${j}`)),
        };
        matrixelem.compCosts.push(compcost);
      }

      for (let k = 0; k < nodes; k++) {
        let commcost: CommCost = {
          task: task(k),
          weight: Number(data.get(`adjcell${i}${k}`)),
        };
        adjelem.commCosts.push(commcost);
      }
      compArr.push(matrixelem);
      adjArr.push(adjelem);
    }

    axios({
      method: "post",
      url: "http://" + import.meta.env.VITE_MASTER_URL + "/ippts",
      headers: { "content-type": "application/json" },
      responseType: "json",
      data: {
        taskGraph: adjArr,
        computationCostMatrix: compArr,
      },
    })
      .then(function (response) {
        console.log("ippts output array =", response.data);
        sessionStorage.setItem("ippts-output", JSON.stringify(response.data));
        if (subButton == "run") {
          setOut(true);
        } else if (subButton == "simulate") {
            setSimProgVal(true)
          connectSocket();
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <ThemeProvider theme={theme}>
      <div>
        <h1
          style={{
            backgroundColor: "#1e1e1e",
            color: "#bb86fc",
            padding: "3vh",
            margin: "0",
          }}
        >
          IPPTS ALGORITHM SIMULATION
        </h1>
        <Container maxWidth="xl">
          <form onSubmit={sendData}>
            <div style={{ marginBlock: "2em" }}>
              <p>Enter the number of Nodes(Tasks) in Graph:</p>
              <TextField
                inputProps={{
                  type: "text",
                  pattern: "[0-9]*",
                  maxLength: "2",
                  style: { padding: "0.5em" },
                }}
                color="primary"
                focused
                value={nodes}
                onChange={(e) => {
                    setNodes(Number(e.currentTarget.value));
                    setSimRespVal(false);
                    setSimProgVal(false);
                    setOut(false);
                }}
              />
              <p>Enter the number of Servers:</p>
              <TextField
                inputProps={{
                  type: "text",
                  maxLength: "2",
                  pattern: "[0-9]*",
                  style: { padding: "0.5em" },
                }}
                color="primary"
                focused
                value={procs}
                onChange={(e) => {
                  setProcs(Number(e.currentTarget.value));
                  if (
                    Number(e.currentTarget.value) <= 3 &&
                    Number(e.currentTarget.value) > 0
                  ) {
                    setDis(false);
                  } else {
                    setDis(true);
                  }
                }}
              />
            </div>

            <div style={{ marginBlock: "2em" }}>
              <p>Enter the Adjacency Matrix of the Task Graph:</p>
              <div style={{ overflowX: "auto" }}>
                <table className="adjMat" id="adjMat">
                  <tbody>
                    <Table num1={nodes} num2={nodes} expr={false} />
                  </tbody>
                </table>
              </div>
            </div>

            <div style={{ marginBlock: "2em" }}>
              <p>Enter the Computation Cost Matrix (along with expression):</p>
              <div style={{ overflowX: "auto" }}>
                <table className="compMat" id="compMat">
                  <tbody>
                    <Table num1={nodes} num2={procs + 1} expr={true} />
                  </tbody>
                </table>
              </div>
            </div>

            <Button
              type="submit"
              onClick={() => {
                setSubButton("run");
                setDownJson(false);
              }}
              name="run"
              sx={{
                marginInline: "2em",
                marginBlock: "1em",
                fontSize: `calc(12px + 1vmin)`,
              }}
              variant="outlined"
              color="warning"
            >
              RUN ALGO
            </Button>
            <Button
              type="submit"
              onClick={() => {
                setSubButton("simulate");
                  setDownJson(false);
                  if (socket != undefined) {
                    setCounter("disconnect");                      
                  }                
              }}
              name="simulate"
              sx={{
                marginInline: "2em",
                marginBlock: "1em",
                fontSize: `calc(12px + 1vmin)`,
              }}
              disabled={dis}
              variant="outlined"
              color="warning"
            >
              SIMULATE
            </Button>

            {out ? <ReactChart servers={procs} tasks={nodes} /> : <div></div>}
                      
            {simProgVal ? (
                <div style={{ marginTop: "2rem", paddingBottom: "1rem"}}>RESULT OF REALTIME IPPTS SIMULATION:</div>
            ) : (
                <div></div>
            )}
                      
            {simRespVal ? (
              <SimChart SimArray={simResp} servers={procs} />
            ) : (
              <div></div>
            )}

            <div id="dispTasks">
              {simProgVal ? (
                <div
                  style={{
                    color: "rgba(209, 213, 219, 1)",
                    width: "90%",
                    marginInline: "5%",
                    textAlign: "left",
                    overflowY: "scroll",
                    height: "150px",
                    fontSize: "0.75em",
                  }}
                >
                  {progress.map((progress, i) => {
                    if (i != 0) {
                      return (
                        <div key={i} style={{ marginTop: "0.5em" }}  ref={scrollTasks}>
                          {progress.serverUrl} (Server {progress.serverId}) |{" "}
                          {progress.serverTime} | Task {progress.taskId + 1} is{" "}
                          {progress.result}
                        </div>
                      );
                    }
                  })}
                </div>
              ) : (
                <div></div>
              )}
            </div>
            <Button
              sx={{
                marginInline: "2em",
                marginBlock: "1em",
                fontSize: `calc(12px + 1vmin)`,
              }}
              disabled={downJson}
              variant="outlined"
              color="success"
              onClick={downloadFile}
            >
              Download Result
            </Button>
            {/*<Button
              sx={{
                marginInline: "2em",
                marginBlock: "1em",
                fontSize: `calc(12px + 1vmin)`,
              }}
              disabled={!simRespVal}
              variant="outlined"
              color="error"
              onClick={() => {                  
                      setCounter("disconnect")
                  }}
            >
              STOP SIMULATION
            </Button>*/}
          </form>
        </Container>
      </div>
    </ThemeProvider>
  );
};
