import { Container } from '@material-ui/core';
import { ThemeProvider } from '@mui/material';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button'
import React from 'react';
import { ComputationCost, ComputationCostMatrix, ComputationCostMatrixElem, TaskGraphAdjMatrix, TaskGraphAdjMatrixElem, CommCost } from "../types/inittypes";
import { Task } from '../types/basetypes';
import theme from './theme'
import Table from './table'
import axios from 'axios'

export const Home: React.FC = () => {

    const [nodes, setNodes] = React.useState(2)
    const [procs, setProcs] = React.useState(2)
    const [dis, setDis] = React.useState(false)

    const sendData = (event) => {
        let adjArr: TaskGraphAdjMatrix = []
        let compArr: ComputationCostMatrix = []
        event.preventDefault()
        const data = new FormData(event.target)

        const task = (i: number) => {
            let task: Task = {
                expression: data.get(`expr${i}`) as string,
                taskId: i,
            }
            return (task)
        }

        for (let i = 0; i < nodes; i++){
            let matrixelem: ComputationCostMatrixElem = {
                task: task(i),
                compCosts: []
            }

            let adjelem: TaskGraphAdjMatrixElem = {
                task: task(i),
                commCosts: []
            }

            for (let j = 0; j < procs; j++){
                let compcost: ComputationCost = {
                    server: {
                        url: "",
                        serverId: j
                    },
                    cost : Number(data.get(`adjcell${i}${j}`))
                }
                matrixelem.compCosts.push(compcost)         
            }

            for (let k = 0; k < nodes; k++){
                let commcost: CommCost = {
                    task: task(k),
                    weight: Number(data.get(`adjcell${i}${k}`))
                }
                adjelem.commCosts.push(commcost)
            }
            compArr.push(matrixelem)
            adjArr.push(adjelem)
        }

        console.log("adj matrix =", adjArr)
        console.log("comp matrix =", compArr)
        alert("check the console!")
      
        axios({
            method: 'post',
            url: 'http://localhost:5030/ippts',
            data: {
                "taskGraph": adjArr,
                "computationCostMatrix": compArr
            }
        }).then(function (response) {
            console.log("output =", response.data)
        }).catch(function (error) {
            console.log(error)
        })
    }

    return (
        <ThemeProvider theme={theme}>
            <div>
                <h1 style={{ backgroundColor: "#1e1e1e", color: "#bb86fc", padding: "3vh", margin: "0" }}>
                    IPPTS ALGORITHM SIMULATION
                </h1>
                <Container maxWidth="xl">

                    <form onSubmit={sendData}>

                    <div style={{ marginBlock: "2em" }}>
                        <p>
                            Enter the number of Nodes(Tasks) in Graph: 
                        </p>
                        <TextField inputProps={{ type: 'text', pattern: '[0-9]*', maxLength: '2', style: { padding: '0.5em' } }} color="primary" focused value={nodes} onChange={(e) => setNodes(Number(e.currentTarget.value))} />
                        <p>
                            Enter the number of Servers: 
                        </p>
                        <TextField inputProps={{ type: 'text', maxLength: '2', pattern: '[0-9]*', style: { padding: '0.5em' } }} color="primary" focused value={procs}
                            onChange={(e) => {
                                setProcs(Number(e.currentTarget.value));
                                if (Number(e.currentTarget.value) <= 3 && Number(e.currentTarget.value) > 0) { setDis(false) }
                                else { setDis(true) }
                            }} />
                    </div>

                    <div style={{ marginBlock: "2em" }}>
                    <p>
                        Enter the Adjacency Matrix of the Task Graph:
                    </p>
                    <div style={{overflowX: 'auto'}}>
                    <table className="adjMat" id="adjMat">
                        <Table num1={nodes} num2={nodes} expr={false} />
                    </table>
                    </div>
                    </div>

                    <div style={{ marginBlock: "2em" }}>
                    <p>
                        Enter the Computation Cost Matrix (along with expression):
                    </p>
                    <div style={{overflowX: 'auto'}}>
                    <table className="compMat" id="compMat">
                        <Table num1={nodes} num2={procs+1} expr={true} />
                    </table>
                    </div> 
                    </div>

                    <Button type="submit" name="run" sx={{ marginInline: '2em', marginBlock: '1em' }} variant="outlined" color="warning">RUN ALGO</Button>
                    <Button type="submit" name="simulate" sx={{marginInline: '2em', marginBlock: '1em'}} disabled={dis} variant="outlined" color="warning">SIMULATE</Button>

                    </form>
                   
                </Container>
            </div>
        </ThemeProvider>
    )
};