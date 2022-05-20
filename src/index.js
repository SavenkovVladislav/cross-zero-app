import { toHaveStyle } from '@testing-library/jest-dom/dist/matchers';
import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';

function Square(props) {
    return (
        <button
            className={props.isLastClicked ? 'square square--last-clicked' : 'square'} // в зависимости от значения isLastClicked в атрибут className записывается та или иная строка
            onClick={props.onClick}
        >
            {props.value}
        </button>
    );
}

class BoardRow extends React.Component {
    render() {
        return (
            <div className='board-row'>
                {
                    Array(3) // действия, которые описаны ниже проходят один раз
                        .fill() // результат [undefined,undefined,undefined]
                        .map((item, index) => {
                            return index + this.props.offset
                        }) // результат при первом вызове компонента BoardRow [0,1,2], при втором [3,4,5]
                        .map(item => {
                            return (
                                <Square
                                    key={item}
                                    value={this.props.squares[item]} // в компоненте Boart мной не описан конструктор с объявленными пропасами, но по умолчанию, он существует и принимает их.
                                    onClick={() => this.props.onClick(item)}
                                    isLastClicked={this.props.lastClickedCellIndex === item} // в выражении lastClickCellIndex === i возвращается true, если кликнули на новый квадрат то ничего не возвращается
                                />
                            )
                        }) // мы маппим массив [0,1,2] (при первом вызове BoardRow) и пихаем в item 0,1,2
                }
            </div>
        );
    }

}

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
                value={this.props.squares[i]} // в компоненте Boart мной не описан конструктор с объявленными пропасами, но по умолчанию, он существует и принимает их.
                onClick={() => this.props.onClick(i)}
                isLastClicked={this.props.lastClickedCellIndex === i} // в выражении lastClickCellIndex === i возвращается true, если кликнули на новый квадрат то ничего не возвращается
            />
        );
    }

    render() {
        return (
            <div>
                {
                    [0, 3, 6].map(item => {
                        return (
                            <BoardRow
                                key={item}
                                offset={item}
                                squares={this.props.squares}
                                onClick={this.props.onClick}
                                lastClickedCellIndex={this.props.lastClickedCellIndex}
                            />
                        )
                    }
                    )
                }
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
            lastClickedCellIndexHistory: [null],
            stepNumber: 0,
            xIsNext: true,
            isAscending: true,
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const indexHistory = this.state.lastClickedCellIndexHistory.slice(0, this.state.stepNumber + 1)
        const current = history[history.length - 1]; // записываем в current последний элемент массива history
        const squares = current.squares.slice();

        if (calculateWinner(squares) || squares[i]) { // в squares[i] может лежать либо null либо "Х" либо "О" 
            return;
        }

        squares[i] = this.state.xIsNext ? 'X' : 'O'; // при первом нажатии на правый нижний угол доски масив squares будет выглядить следующим образом [null, null, null, null, null, null, null, null, 'X']

        this.setState({ // пример: [1, 2, 3].concat([4, 5, 6]) -> результатом этого будет массив [1, 2, 3, 4, 5, 6]
            history: history.concat([
                {
                    squares: squares
                }
            ]),
            lastClickedCellIndexHistory: indexHistory.concat([
                i,
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

    switchHandler() {
        this.setState({
            isAscending: !this.state.isAscending,
        });
    }

    render() {
        const history = this.state.history;
        const indexHistory = this.state.lastClickedCellIndexHistory;

        const current = history[this.state.stepNumber];
        const currentIndex = indexHistory[this.state.stepNumber];

        const winner = calculateWinner(current.squares); // вызывается функция calculateWinner, в параметрах вызывается свойство squares объекта current, который описан строчкой выше

        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move :
                'Go to game start';

            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button> {/* у каждой кнопки есть СВОЯ стрелочная функция и каждая кнопка имеет свое значение move, которое передается в параметр jumpTo */}
                </li>
            )
        })

        if (!this.state.isAscending) {
            moves.reverse()
        }

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
                        lastClickedCellIndex={currentIndex}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                    <button onClick={() => this.switchHandler()}>Switch</button>
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




