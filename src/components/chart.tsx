import { Chart } from "react-google-charts"

function ReactChart({ servers, tasks }: { servers: number, tasks: number }) {

    var output = sessionStorage.getItem('ippts-output')
    var object = JSON.parse(output)
    var length = object.length
    var height = servers * 70 + 'px'
    
    var rows = []
    rows.push([
        { type: 'string', id: 'Server' },
        { type: 'string', id: 'Task' },
        { type: 'date', id: 'Start' },
        { type: 'date', id: 'End' }
    ])

    for (let i = 0; i < length; i++){
        let server: string = 'Server' + (object[i].server.serverId+1)
        let task: string = 'Task' + (object[i].task.taskId+1)
        let est: number = object[i].est
        let eft: number = object[i].eft
        rows.push([
            server,
            task,
            new Date(est),
            new Date(eft)            
        ])
    }

    return (
        <div style={{ marginTop: "2rem" }} className="chart">
        RESULT OF TASK SCHEDULING BY THE IPPTS ALGO:<br/><br/>
        <Chart
            width={'90%'}
            height={height}
            chartType="Timeline"
            loader={<h3 style={{ color: 'white' }}>Loading Chart</h3>}
            data={rows}
            
            options={{
                backgroundColor: '#1e1e1e',
                colors: ['#ff593a', '#efe73e', '#90ee02', '#bb86fc', '#03dac5'],
                timeline: {
                    rowLabelStyle: {
                        fontName: 'monospace',
                        fontSize: `calc(12px + 1vmin)`,
                        color: 'white',
                    },
                    barLabelStyle: { fontName: 'monospace', fontSize: `calc(12px + 1vmin)`, color: 'white' },
                },
                avoidOverlappingGridLines: false,
            }}

            rootProps={{ 'class' : 'g-chart' }}
            />
        </div>
    )
}

export default ReactChart;