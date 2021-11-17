const Cell = ({ row, col }: { row: number, col: number }) => (
    <td>
        <input id={`cell${row}${col}`} type='text' maxLength={Number('3')} />
    </td>
)

const Expr = ({ row }: { row: number }) => (
    <td>
        <input id={`expr${row}`} type='text' maxLength={Number('20')} />
    </td>
) 

function Table({ num1, num2, expr }: { num1: number, num2: number, expr: boolean }) {
    
    let cols: JSX.Element[] = [];
    let rows: JSX.Element[] = [];

    for (let i = 1; i <= num1; i++){
        cols = [];
        for (let j = 1; j <= num2; j++){
            if (expr == true && j == num2) {
                cols.push(<Expr row={i} />)                    
            }
            else {
                cols.push(<Cell row={i} col={j} />)                
            }
        }
        rows.push(<tr><td>Task{i}</td>{cols}</tr>)
    }

    return (
        <>
            {rows}
        </>
    )
}

export default Table;