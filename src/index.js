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
        squares[i] = this.state.xIsNext ? 'X' : 'O'; // в зависимости от того this.state.xIsNext = true или false мы записываем в i-тый элемент массива squares 'X' или 'O'

        this.setState({
            squares: squares, // здесь мы присваеваем ключу squares значение переменной squares
            xIsNext: !this.state.xIsNext, // здесь мы инвертируем значение ключа xIsNext
        });

        console.log('переменная', squares);
        console.log('массив', this.state.squares); // почему запись "X" в this.state.squares происходит с задержкой в итерацию?


    }

    renderSquare(i) {
        return (
            <Square
                value={this.state.squares[i]}
                onClick={() => this.handleClick(i)} //?
            />
        );
    }

    render() {
        const status = 'Следующий игрок: ' + (this.state.xIsNext ? 'X' : 'O');

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

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);




