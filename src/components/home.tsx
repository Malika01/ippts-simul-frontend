import { Container } from '@material-ui/core';
import { ThemeProvider } from '@mui/material';
import TextField from '@mui/material/TextField';
import React from 'react';
import * as types from '../types/inittypes'
import theme from './theme'
import Table from './table'

export const Home: React.FC = () => {

    const [nodes, setNodes] = React.useState(1)
    const[procs, setProcs] = React.useState(1)
    return (
        <ThemeProvider theme={theme}>
            <div>
                <h1 style={{ backgroundColor: "#1e1e1e", color: "#bb86fc", padding: "3vh", margin: "0" }}>
                    IPPTS ALGORITHM SIMULATION
                </h1>
                <Container maxWidth="xl">
                    <div style={{ marginBlock: "2em" }}>
                        <p>
                            Enter the number of Nodes(Tasks) in Graph: 
                        </p>
                        <TextField inputProps={{ type: 'text', pattern: '[0-9]*', maxlength: '2', style: { padding: '0.5em' } }} color="primary" focused value={nodes} onChange={(e) => setNodes(Number(e.currentTarget.value))} />
                        <p>
                            Enter the number of Servers: 
                        </p>
                        <TextField inputProps={{ type: 'text', maxlength: '2', pattern: '[0-9]*', style: { padding: '0.5em' } }} color="primary" focused value={procs} onChange={(e) => setProcs(Number(e.currentTarget.value))}/>
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
                        Enter the Computation Cost Matrix (along with expr value in the last col):
                    </p>
                    <div style={{overflowX: 'auto'}}>
                    <table className="compMat" id="compMat">
                        <Table num1={nodes} num2={procs+1} expr={true} />
                    </table>
                    </div> 
                    </div>                 
                   
                </Container>
            </div>
        </ThemeProvider>
    )
};