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
    constructor(props) {
        super(props);

        this.state = {
            squares: Array(9).fill(null), // метод fill() заполняет все элементы массива от начального до конечного индексов одним значением. 
            xIsNext: true,
        };
    }

    handleClick(i) {
        const squares = this.state.squares.slice(); // метод slice() возвращает новый массив, содержащий копию части или всего исходного массива.
        // осбсудить этот if
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O'; // в зависимости от того this.state.xIsNext = true или false мы записываем в i-тый элемент массива squares 'X' или 'O'

        this.setState({
            squares: squares, // здесь мы присваеваем ключу squares значение переменной squares
            xIsNext: !this.state.xIsNext, // здесь мы инвертируем значение ключа xIsNext
        },
            () => {
                console.log('массив', this.state.squares); // здесь мы вызываем стрелочную функицю, которая называется callback, это второй аргумент функции setState, которая вызывается после того, как setState закончил свою работу
            });

        console.log('переменная', squares);
    }

    renderSquare(i) {
        return (
            <Square
                value={this.state.squares[i]}
                onClick={() => this.handleClick(i)}
            />
        );
    }

    render() {

        const winner = calculateWinner(this.state.squares);
        let status;
        if (winner) {
            status = 'Победитель: ' + winner;
        } else {
            status = 'Следующий игрок: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div>
                <div className="status">{status}</div>
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
    render() {
        return (
            <div className="game">
                <div className="game-board">
                    <Board />
                </div>
                <div className="game-info">
                    <div>{/* status */}</div>
                    <ol>{/* TODO */}</ol>
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




