import React from 'react'
import { Board } from './chess/Board'
import { useChess } from './chess/useChess'

export default function App() {
  const {
    board,
    turn,
    selected,
    legalTargets,
    onSquareClick,
    history,
    restart,
    status,
    whiteClock,
    blackClock,
    toggleClock,
    suggestMove,
  } = useChess()

  return (
    <div className="app">
      <header className="app__header">
        <h1>Kali Chess</h1>
        <div className="status">
          <span>Turn: {turn === 'w' ? 'White' : 'Black'}</span>
          <span>{status}</span>
        </div>
      </header>
      <main className="app__main">
        <div className="panel panel--left">
          <Board
            board={board}
            selected={selected}
            legalTargets={legalTargets}
            onSquareClick={onSquareClick}
          />
        </div>
        <div className="panel panel--right">
          <div className="clocks">
            <div className="clock clock--white">White: {formatClock(whiteClock)}</div>
            <div className="clock clock--black">Black: {formatClock(blackClock)}</div>
            <div className="clock__controls">
              <button onClick={toggleClock}>Start/Pause</button>
              <button onClick={restart}>Restart</button>
              <button onClick={suggestMove}>Suggest Move</button>
            </div>
          </div>
          <div className="history">
            <h3>Move History</h3>
            <ol>
              {history.map((h, i) => (
                <li key={i}>{h}</li>
              ))}
            </ol>
          </div>
        </div>
      </main>
    </div>
  )
}

function formatClock(ms: number) {
  const t = Math.max(0, ms)
  const m = Math.floor(t / 60000)
  const s = Math.floor((t % 60000) / 1000)
  return `${m}:${s.toString().padStart(2, '0')}`
}