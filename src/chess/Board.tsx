import React from 'react'

type Piece = {
  type: string
  color: 'w' | 'b'
} | null

type BoardProps = {
  board: (Piece[])[]
  selected: string | null
  legalTargets: Set<string>
  onSquareClick: (square: string) => void
}

const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']

export function Board({ board, selected, legalTargets, onSquareClick }: BoardProps) {
  return (
    <div className="board">
      {board.map((rank, rIdx) => (
        <div className="rank" key={rIdx}>
          {rank.map((piece, fIdx) => {
            const file = files[fIdx]
            const rankNum = 8 - rIdx
            const square = `${file}${rankNum}`
            const isDark = (rIdx + fIdx) % 2 === 1
            const isSelected = selected === square
            const isLegal = legalTargets.has(square)
            return (
              <button
                key={square}
                className={`square ${isDark ? 'square--dark' : 'square--light'} ${
                  isSelected ? 'square--selected' : ''
                } ${isLegal ? 'square--legal' : ''}`}
                onClick={() => onSquareClick(square)}
              >
                <span className={`piece piece--${piece?.color ?? ''}`}>{pieceSymbol(piece)}</span>
              </button>
            )
          })}
        </div>
      ))}
    </div>
  )
}

function pieceSymbol(p: Piece) {
  if (!p) return ''
  const map: Record<string, string> = {
    pw: '♙',
    rw: '♖',
    nw: '♘',
    bw: '♗',
    qw: '♕',
    kw: '♔',
    pb: '♟︎',
    rb: '♜',
    nb: '♞',
    bb: '♝',
    qb: '♛',
    kb: '♚',
  }
  return map[`${p.type}${p.color}`]
}