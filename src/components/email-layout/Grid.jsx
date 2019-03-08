import React from 'react';

function Cell({ children }) {
    return <td>{children}</td>;
}

function Row({ children }) {
    return (
        <tr>
            {React.Children.map(children, (el) => {
                if (el.type === Cell) return el;

                return <td>{el}</td>;
            })}
        </tr>
    );
}

function Grid({ children }) {
    return (
        <table>
            <tbody>
                {React.Children.map(children, (el) => {
                    if (!el) return;

                    if (el.type === Row) return el;

                    if (el.type === Cell) {
                        return <tr>{el}</tr>;
                    }

                    return (
                        <tr>
                            <td>{el}</td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}

Grid.Row = Row;
Grid.Cell = Cell;

export default Grid;