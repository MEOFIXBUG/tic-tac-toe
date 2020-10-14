import React from 'react';
import Board from './Board';

const calculateWinner = (squares) => {
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

  for (let i = 0; i < lines.length; i += 1) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], winnerRow: lines[i] };
    }
  }

  return { winner: null, winnerRow: null };
};

const getLocation = (move) => {
  const locationMap = {
    0: 'dòng: 1, cột: 1',
    1: 'dòng: 1, cột: 2',
    2: 'dòng: 1, cột: 3',
    3: 'dòng: 2, cột: 1',
    4: 'dòng: 2, cột: 2',
    5: 'dòng: 2, cột: 3',
    6: 'dòng: 3, cột: 1',
    7: 'dòng: 3, cột: 2',
    8: 'dòng: 3, cột: 3',
  };

  return locationMap[move];
};

const initialState = {
  history: [
    {
      squares: Array(9).fill(null),
    },
  ],
  currentStepNumber: 0,
  xIsNext: true,
};

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.currentStepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (calculateWinner(squares).winner || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([
        {
          squares,
          currentLocation: getLocation(i),
          stepNumber: history.length,
        },
      ]),
      xIsNext: !this.state.xIsNext,
      currentStepNumber: history.length,
    });
  }

  jumpTo(step) {
    this.setState({
      currentStepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }

  sortMoves() {
    this.setState({
      history: this.state.history.reverse(),
    });
  }

  reset() {
    this.setState(initialState);
  }

  render() {
    const { history } = this.state;
    const current = history[this.state.currentStepNumber];
    const { winner, winnerRow } = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const currentLocation = step.currentLocation ? `(${step.currentLocation})` : '';
      const desc = step.stepNumber ? `Move #${step.stepNumber}` : 'Start';
      const classButton = move === this.state.currentStepNumber ? 'button--green' : '';

      return (
        <li key={move}>
          <button className={`${classButton} button`} onClick={() => this.jumpTo(move)}>
            {`${desc} ${currentLocation}`}
          </button>
        </li>
      );
    });

    let status;
    let statusClass="status";
    if (winner) {
      status = `Winner ${winner}`;
      statusClass="statusWinner";
    } else if (history.length === 10) {
      status = 'Draw. No one won.';
      statusClass="statusDraw"
    } else {
      status = `Next player: ${this.state.xIsNext ? 'X' : 'O'}`;
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            winnerSquares={winnerRow}
            onClick={i => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div className={`${statusClass}`}>{status}</div>
          <button className="button" onClick={() => this.sortMoves()}>
            Sort moves
          </button>
          <button className="button button--new-game" onClick={() => this.reset()}>
            New game
          </button>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

export default Game;
