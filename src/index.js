import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className= {props.isHL ? "square winner" :  "square"}
            onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    if (this.props.hightLight.indexOf(i) !== -1){
      return (
        <Square
        isHL = {true}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        />
      )
    }
    else{
      return (
        <Square
          isHL = {false}
          value={this.props.squares[i]}
          onClick={() => this.props.onClick(i)}
        />
      );
    } 
  }

  render() {
    var rendersquares = [];
    var squarenum = 0;
    for (var row = 0; row < 3; row++){
      rendersquares.push(<div className="board-row"></div>);
      for (var col = 0; col < 3; col++){
        rendersquares.push(this.renderSquare(squarenum));
        squarenum++
      }
    }
    return (
      <div>{rendersquares}</div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
        }
      ],
      stepNumber: 0,
      xIsNext: true,
      isAscend: true
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const locations = [
      [1, 1],
      [2, 1],
      [3, 1],
      [1, 2],
      [2, 2],
      [3, 2],
      [1, 3],
      [2, 3],
      [3, 3]
    ];
    const isWin = calculateWinner(squares)
    if (isWin.player || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares,
          locations: locations[i]
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }
  
  reverseorder(){
    this.setState({
      isAscend: !this.state.isAscend
    })
  }
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move + ' at [' + history[move].locations+']' :
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>
            {move === this.state.stepNumber ? <strong>{desc}</strong> : desc}
          </button>
        </li>
      );
    });

    let status;
    if (winner.player) {
      status = "Winner: " + winner.player;
    }
    else if(!current.squares.includes(null)){
      status = "【 Draw 平手】";
    }
    else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares = {current.squares}
            onClick = {i => this.handleClick(i)}
            winner = {winner.player}
            hightLight = {winner.hightLight}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{this.state.isAscend ? moves : moves.reverse()}</ol>
          <ol>目前排序方式: {this.state.isAscend ? "Ascending" : "Descneding"}</ol>
          <ol><button onClick={() => this.reverseorder()}>
            變更排序方式
          </button></ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        player:squares[a],
        hightLight: [a,b,c]
      };
    }
  }
  return {
    player : null,
    hightLight : []
  };
}
