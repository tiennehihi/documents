// Game.jsx
import React, { useState } from 'react';
import Board from '../board/index';
import UserProfile from '../userProfile/index';
import './index.css';

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
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }

  return null;
}

function Game() {
  const [history, setHistory] = useState([{ squares: Array(9).fill(null) }]);
  const [stepNumber, setStepNumber] = useState(0);
  const xIsNext = stepNumber % 2 === 0;

  const handleClick = (i) => {
    const newHistory = history.slice(0, stepNumber + 1);
    const current = newHistory[newHistory.length - 1];
    const squares = current.squares.slice();

    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = xIsNext ? 'X' : 'O';
    setHistory(newHistory.concat([{ squares: squares }]));
    setStepNumber(newHistory.length);
  };

  const current = history[stepNumber];
  const winner = calculateWinner(current.squares);
  // const tie = squares.every((square) => square != null);
  // let status;
  // if (winner) {
  //     if (winner === 'X') {
  //         status = 'Player 1 is winner';
  //     } else {
  //         status = 'Player 2 is winner';
  //     }
  // } else {
  //     if (tie) {
  //         status = 'Tie game';
  //     } else {
  //         status = '';
  //     }
  //   }

  const handleReset = () => {
    setHistory([{ squares: Array(9).fill(null) }]);
    setStepNumber(0);
  };

  const profiles = [
    { name: 'Phương Ly', image: 'https://image.voh.com.vn/voh/Image/2018/12/20/434225737455109191357645636277370563330048n_20181220150837.jpg', active: xIsNext, winner: winner === 'X' },
    { name: 'Quỳnh Kool', image: 'https://toquoc.mediacdn.vn/280518851207290880/2021/3/14/15253497622933892974712405640560402592920124o-1615731932782980896116.jpeg', active: !xIsNext, winner: winner === 'O' },
  ];

  return (
    <div className="game">
      <div className="game-info">
        <div className="user-profiles">
          {profiles.map((profile, index) => (
            <UserProfile key={index} {...profile} />
          ))}
        </div>
      </div>
      <div className="game-board">
        <Board squares={current.squares} onClick={handleClick} />
      </div>
      <button className="reset" value="reset" onClick={handleReset}>Reset</button>
      {winner && (
        <div className='name-winner'>
            Winner: <b>{profiles.find(profile => profile.winner)?.name || ''}</b>
        </div>
      )}
    </div>
  );
}

export default Game;
