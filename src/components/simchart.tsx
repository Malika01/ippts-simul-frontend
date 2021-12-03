import { Chart } from "react-google-charts"

function SimChart({ SimArray , servers }: { SimArray : {"taskId": number, "result": string}[] , servers : number }) {

    var output = sessionStorage.getItem('ippts-output')
    var object = JSON.parse(output)
    var lenResult = object.length
    var length = SimArray.length
    var height = servers * 70 + 'px'
    
    var rows = []
    rows.push([
        { type: 'string', id: 'Server' },
        { type: 'string', id: 'Task and Result' },
        { type: 'date', id: 'Start' },
        { type: 'date', id: 'End' }
    ])

    for (let i = 1; i < length; i++){
        for (let j = 0; j < lenResult; j++) {
            if (object[j].task.taskId == SimArray[i].taskId) {
                let server: string = 'Server' + (object[j].server.serverId+1)
                let task: string = 'Task' + (object[j].task.taskId+1) + ' , Result = ' + SimArray[i].result
                let est: number = object[j].est
                let eft: number = object[j].eft
                rows.push([
                    server,
                    task,
                    new Date(est),
                    new Date(eft)            
                ])                
            }
        }      
    }

    return (
        <div style={{ marginTop: "0" }} className="chart">
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

export default SimChart;