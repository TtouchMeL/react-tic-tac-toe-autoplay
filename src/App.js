import { useEffect, useState } from 'react';
import './App.css';


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

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares)
  }

  function autoPlay() {
    console.log('auto Play is running')
    var freeIndex = squares.map((v, i) => v == null ? i : -1).filter(i => i !== -1);
    if(checkIfWinning('O')) {
      console.log('case O to win')
    } else if(checkIfWinning('X')) {
      console.log('case not let X win')
    } else {
      var randomIndex = freeIndex[Math.floor(Math.random() * freeIndex.length)];
      console.log('randomIndex ', randomIndex)
      handleClick(randomIndex)
    }
  }

  function checkIfWinning(player) {
    var isGoingToWin = false;
    var mustChoose = 0;
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if ((squares[a] === player && squares[b] === player && squares[c] == null) ||
        (squares[a] === player && squares[b] == null && squares[c] === player) ||
        (squares[a] === null && squares[b] === player && squares[c] === player)) {
        isGoingToWin = true;
        mustChoose = squares[a] == null ? a : squares[b] == null ? b : c
        break;
      }
    }
    if(isGoingToWin) {
      handleClick(mustChoose)
      return true;
    }
    return false;
  }

  const winner = calculateWinner(squares);
  const gameEnd = isGameEnd(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else if (gameEnd) {
    status = 'Tie';
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }
  
  useEffect(() => {
    if (!winner && !gameEnd && !xIsNext) {
      autoPlay()
    }
  }, [xIsNext]);

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function isGameEnd(squares) {
  return squares.filter(square => square == null).length === 0;
}