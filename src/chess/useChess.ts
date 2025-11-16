import { useEffect, useMemo, useRef, useState } from 'react'
import { Chess } from 'chess.js'
import type { Square, Move } from 'chess.js'

export function useChess() {
  const [game] = useState(() => new Chess())
  const [selected, setSelected] = useState<Square | null>(null)
  const [status, setStatus] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [running, setRunning] = useState(false)
  const [whiteClock, setWhiteClock] = useState(5 * 60 * 1000)
  const [blackClock, setBlackClock] = useState(5 * 60 * 1000)
  const lastTickRef = useRef<number | null>(null)

  const board = useMemo(() => game.board(), [game, game.fen()])
  const turn = game.turn()

  useEffect(() => {
    const id = setInterval(() => {
      if (!running) return
      const now = performance.now()
      const last = lastTickRef.current ?? now
      const diff = now - last
      lastTickRef.current = now
      if (turn === 'w') setWhiteClock((t) => t - diff)
      else setBlackClock((t) => t - diff)
    }, 100)
    return () => clearInterval(id)
  }, [running, turn])

  useEffect(() => {
    if (game.isGameOver()) {
      setRunning(false)
      if (game.isCheckmate()) setStatus('Checkmate')
      else if (game.isDraw()) setStatus('Draw')
      else setStatus('Game Over')
    } else {
      setStatus('')
    }
  }, [game, game.fen()])

  const legalTargets = useMemo(() => {
    if (!selected) return new Set<string>()
    const moves = game.moves({ verbose: true }) as Move[]
    return new Set(moves.filter((m) => m.from === selected).map((m) => m.to))
  }, [selected, game, game.fen()])

  function onSquareClick(square: Square) {
    if (selected === square) {
      setSelected(null)
      return
    }
    const piece = game.get(square)
    if (piece && piece.color === turn) {
      setSelected(square)
      return
    }
    if (selected) {
      const result = tryMove(selected, square)
      if (result) {
        setSelected(null)
        setHistory((h) => [...h, result.san])
        if (!running) setRunning(true)
      }
    }
  }

  function tryMove(from: Square, to: Square) {
    try {
      return game.move({ from, to, promotion: 'q' })
    } catch {
      return null
    }
  }

  function restart() {
    game.reset()
    setHistory([])
    setSelected(null)
    setWhiteClock(5 * 60 * 1000)
    setBlackClock(5 * 60 * 1000)
    setRunning(false)
    lastTickRef.current = null
  }

  function toggleClock() {
    setRunning((r) => !r)
    lastTickRef.current = performance.now()
  }

  function suggestMove() {
    const moves = game.moves({ verbose: true })
    if (moves.length === 0) return
    const scored = moves.map((m) => ({
      m,
      score:
        (m.flags.includes('c') ? 3 : 0) +
        (m.san.includes('+') ? 1 : 0) +
        (m.promotion ? 2 : 0),
    }))
    scored.sort((a, b) => b.score - a.score || Math.random() - 0.5)
    const best = scored[0].m
    tryMove(best.from, best.to)
    setHistory((h) => [...h, best.san])
  }

  return {
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
  }
}