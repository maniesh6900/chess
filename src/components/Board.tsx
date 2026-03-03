import { Color, PieceSymbol, Square } from 'chess.js'
import { useCallback, useEffect, useState } from 'react'
import { MOVE } from '../screen/Game'

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
const RANKS = ['8', '7', '6', '5', '4', '3', '2', '1']

function getPieceImage(type: PieceSymbol, color: Color): string {
  if (color === 'b') return `/${type}.png`
  return `/${type.toUpperCase()} copy.png`
}

interface ChessBoardProps {
  chess: any
  setBoard: (board: any) => void
  board: ({ square: Square; type: PieceSymbol; color: Color } | null)[][]
  socket: WebSocket | null
  canInteract: boolean
  playerColor: 'w' | 'b' | null
  status: 'idle' | 'waiting' | 'playing' | 'over'
}

function ChessBoard({ chess, board, socket, setBoard, canInteract, playerColor, status }: ChessBoardProps) {
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null)
  const [lastMove, setLastMove] = useState<{ from: Square; to: Square } | null>(null)

  useEffect(() => {
    if (status !== 'playing') {
      setSelectedSquare(null)
      setLastMove(null)
    }
  }, [status])

  const handleSquareClick = useCallback(
    (square: Square) => {
      if (!canInteract) return

      const clickedPiece = chess.get(square)

      if (!selectedSquare) {
        if (clickedPiece?.color === (playerColor ?? chess.turn())) {
          setSelectedSquare(square)
        }
        return
      }

      if (clickedPiece?.color === (playerColor ?? chess.turn()) && selectedSquare !== square) {
        setSelectedSquare(square)
        return
      }

      try {
        const move = chess.move({ from: selectedSquare, to: square })
        if (!move) return

        setLastMove({ from: selectedSquare, to: square })
        setBoard(chess.board())

        if (socket) {
          socket.send(
            JSON.stringify({
              type: MOVE,
              payload: { move: { from: selectedSquare, to: square } },
            })
          )
        }
      } catch {
        // invalid move
      }

      setSelectedSquare(null)
    },
    [canInteract, playerColor, selectedSquare, chess, setBoard, socket]
  )

  const isSelected = (sq: Square) => selectedSquare === sq
  const isLastMove = (sq: Square) => lastMove?.from === sq || lastMove?.to === sq

  return (
    <div className="animate-scale-in">
      <div className="board-shadow rounded-sm overflow-hidden">
        <div className="flex">
          <div className="w-7" />
          {FILES.map((file) => (
            <div
              key={file}
              className="w-14 h-5 sm:w-16 sm:h-6 flex items-center justify-center text-[10px] sm:text-xs font-semibold text-amber-200/60 bg-amber-950/80"
            >
              {file}
            </div>
          ))}
          <div className="w-1" />
        </div>

        {board.map((row, i) => (
          <div key={i} className="flex">
            <div className="w-7 flex items-center justify-center text-[10px] sm:text-xs font-semibold text-amber-200/60 bg-amber-950/80">
              {RANKS[i]}
            </div>

            {row.map((square, j) => {
              const sq = (FILES[j] + RANKS[i]) as Square
              const isLight = (i + j) % 2 === 0
              const selected = isSelected(sq)
              const moved = isLastMove(sq)

              let bgColor: string
              if (selected) {
                bgColor = 'bg-yellow-400/70'
              } else if (moved) {
                bgColor = isLight ? 'bg-board-last-move-light' : 'bg-board-last-move-dark'
              } else {
                bgColor = isLight ? 'bg-board-light' : 'bg-board-dark'
              }

              const hoverColor = selected
                ? ''
                : isLight
                  ? 'hover:bg-board-light-hover'
                  : 'hover:bg-board-dark-hover'

              return (
                <div
                  key={j}
                  onClick={() => handleSquareClick(sq)}
                  className={`w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center
                    transition-colors duration-100 ${bgColor} ${hoverColor}
                    ${canInteract ? 'cursor-pointer' : 'cursor-not-allowed'}
                    ${selected ? 'ring-2 ring-yellow-400 ring-inset z-10' : ''}`}
                >
                  {square && (
                    <img
                      className={`chess-piece w-10 h-10 sm:w-12 sm:h-12 pointer-events-none
                        ${selected ? 'scale-110' : 'hover:scale-105'}`}
                      alt={`${square.color} ${square.type}`}
                      src={getPieceImage(square.type, square.color)}
                      draggable={false}
                    />
                  )}
                </div>
              )
            })}

            <div className="w-1 bg-amber-950/80" />
          </div>
        ))}

        <div className="h-1 bg-amber-950/80" />
      </div>
    </div>
  )
}

export default ChessBoard
