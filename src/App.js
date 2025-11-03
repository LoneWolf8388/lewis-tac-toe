import { useState } from "react";
import "./App.css";

function Square({ value, onClick }) {
  return (
    <button className="square" onClick={onClick} aria-label={`square ${value ?? ""}`}>
      {value}
    </button>
  );
}

function calculateWinner(s) {
  const lines = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  for (const [a,b,c] of lines) {
    if (s[a] && s[a] === s[b] && s[a] === s[c]) return s[a];
  }
  return null;
}

function Board() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const squares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) return;
    const next = squares.slice();
    next[i] = xIsNext ? "X" : "O";
    handlePlay(next);
  }

  function jumpTo(move) { setCurrentMove(move); }

  const winner = calculateWinner(squares);
  const draw = !winner && squares.every(Boolean);
  const status = winner ? `Winner: ${winner}` : draw ? "Draw" : `Next player: ${xIsNext ? "X" : "O"}`;

  return (
    <div className="game">
      <div className="game-board">
        <div className="status" aria-live="polite">{status}</div>
        <div className="board-row">
          {[0,1,2].map(i => <Square key={i} value={squares[i]} onClick={() => handleClick(i)} />)}
        </div>
        <div className="board-row">
          {[3,4,5].map(i => <Square key={i} value={squares[i]} onClick={() => handleClick(i)} />)}
        </div>
        <div className="board-row">
          {[6,7,8].map(i => <Square key={i} value={squares[i]} onClick={() => handleClick(i)} />)}
        </div>
        <button onClick={() => { setHistory([Array(9).fill(null)]); setCurrentMove(0); }}>
          Reset
        </button>
      </div>
      <div className="game-info">
        <ol>
          {history.map((_, move) => (
            <li key={move}>
              <button onClick={() => jumpTo(move)}>
                {move ? `Go to move #${move}` : "Go to game start"}
              </button>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <main>
      <h1>Lewis-Tac-Toe</h1>
      <Board />
    </main>
  );
}
