const CellAdj = ({ row, col }: { row: number, col: number }) => (
    <td>
        <input required id={`adjcell${row}${col}`} name={`adjcell${row}${col}`} type='text' /*maxLength={Number('8')}*/ pattern='[+-]?[0-9]*' title='max 3 digit number' defaultValue='0' />
    </td>
)

const CellDisable = ({ row, col }: { row: number, col: number }) => (
    <td>
        <input disabled id={`adjcell${row}${col}`} name={`adjcell${row}${col}`} type='text' /*maxLength={Number('8')}*/ defaultValue='0' />
    </td>
)

const CellComp = ({ row, col }: { row: number, col: number }) => (
    <td>
        <input required id={`compcell${row}${col}`} name={`compcell${row}${col}`} type='text' /*maxLength={Number('8')}*/ pattern='[0-9]*' title='max 3 digit number'/>
    </td>
)

const Expr = ({ row }: { row: number }) => (
    <td>
        <input id={`expr${row}`} name={`expr${row}`} type='text' maxLength={Number('20')} />
    </td>
) 

function Table({ num1, num2, expr }: { num1: number, num2: number, expr: boolean }) {
    
    let cols: JSX.Element[] = [];
    let rows: JSX.Element[] = [];

    if (expr == true) {
        for (let k = 1; k < num2; k++) [
            cols.push(<td>Server{k}</td>)
        ]
        rows.push(<tr><td></td>{cols}<td>EXPR</td></tr>)        
    }
    else {
        for (let k = 1; k <= num2; k++) [
            cols.push(<td>Task{k}</td>)
        ]
        rows.push(<tr><td></td>{cols}</tr>)
    }

    for (let i = 0; i < num1; i++){
        cols = [];
        for (let j = 0; j < num2; j++){
            if (expr == true) {
                if (j == num2 - 1) {
                    cols.push(<Expr row={i} />)                    
                }
                else {
                    cols.push(<CellComp row={i} col={j} />)                    
                }
            }
            else {
                if (i == j) {
                    cols.push(<CellDisable row={i} col={j} />)
                }
                else {
                    cols.push(<CellAdj row={i} col={j} />)                    
                }
            }
        }
        rows.push(<tr><td>Task{i+1}</td>{cols}</tr>)
    }

    return (
        <>
            {rows}
        </>
    )
}

export default Table;