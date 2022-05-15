import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';

function Square(props) {
    return (
        <button
            className='square'
            onClick={props.onClick}
        >
            {props.value}
        </button>
    );
}


class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
                value={this.props.squares[i]} // в компоненте Boart мной не описан конструктор с объявленными пропасами, но по умолчанию, он существует и принимает их.
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    render() {
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [ // здесь создается массив, элементом которого является объект. Зачем массив? Затем, чтобы в него можно было записывать историю ходов, которая будет храниться в объектах.
                {
                    squares: Array(9).fill(null),
                },
            ],
            stepNumber: 0,
            xIsNext: true,
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();

        if (calculateWinner(squares) || squares[i]) {
            return;
        }

        squares[i] = this.state.xIsNext ? 'X' : 'O'; // при первом нажатии на правый нижний угол доски масив squares будет выглядить следующим образом [null, null, null, null, null, null, null, null, 'X']

        this.setState({ // пример: [1, 2, 3].concat([4, 5, 6]) -> результатом этого будет массив [1, 2, 3, 4, 5, 6]
            history: history.concat([
                {
                    squares: squares
                }
            ]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        }, () => console.log(this.state.history));
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    render() {
        const history = this.state.history;
        //const current = history[history.length - 1]; // запись history[...] означает, что мы обращаемся к элементу массива history под каким-то номером, в нашем случае обращение идет именно к последнему элементу и записываем этот элемент массива в переменную current.
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares); // вызывается функция calculateWinner, в параметрах вызывается свойство squares объекта current, который описан строчкой выше
        // ?
        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move :
                'Go to game start';

            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            )
        })

        let status;
        if (winner) {
            status = 'Победитель: ' + winner;
        } else {
            status = 'Следующий игрок: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

// фунция определения победителя
function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i]; // const [a, b, c] это специальная запись создания нескольких перемынных сразу или деструктуризация, в нашем случае мы записываем в переменные a,b,c, которые мы создаем, i-тый элемент массива lines, т.е. a,b,c при первой итерации цикла будут равны 0,1,2
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);




