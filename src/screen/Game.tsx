import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ChessBoard from '../components/Board'
import Button from '../components/Button'
import useSocket from '../hooks/useSocket'
import { Chess } from 'chess.js'

export const INIT_GAME = 'init_game'
export const MOVE = 'move'
export const GAME_OVER = 'game_over'

type GameStatus = 'idle' | 'waiting' | 'playing' | 'over'
type PlayerColor = 'w' | 'b' | null

function normalizeColor(value: unknown): PlayerColor {
  if (value === 'white' || value === 'w') return 'w'
  if (value === 'black' || value === 'b') return 'b'
  return null
}

function resolveMove(payload: any) {
  if (!payload) return null
  return payload.move ?? payload
}

function Game() {
  const [searchParams] = useSearchParams()
  const isLocalMode = searchParams.get('mode') === 'local'

  const socket = useSocket(!isLocalMode)
  const [chess] = useState(new Chess())
  const [board, setBoard] = useState(chess.board())
  const [status, setStatus] = useState<GameStatus>(isLocalMode ? 'playing' : 'idle')
  const [result, setResult] = useState<string | null>(null)
  const [playerColor, setPlayerColor] = useState<PlayerColor>(null)

  const canMove = status === 'playing' && (!playerColor || chess.turn() === playerColor)

  useEffect(() => {
    if (!socket || isLocalMode) return

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data)

      switch (message.type) {
        case INIT_GAME: {
          chess.reset()
          setBoard(chess.board())
          setStatus('playing')
          setResult(null)

          const colorFromServer = normalizeColor(message.payload?.color ?? message.payload?.playerColor)
          if (colorFromServer) {
            setPlayerColor(colorFromServer)
          }
          break
        }

        case MOVE: {
          const move = resolveMove(message.payload)
          if (!move) break

          try {
            chess.move(move)
            setBoard(chess.board())
          } catch {
            // Ignore duplicate/invalid moves from the network.
          }
          break
        }

        case GAME_OVER: {
          setStatus('over')
          const winner = normalizeColor(message.payload?.winner)
          if (!winner) {
            setResult('Game over')
          } else {
            setResult(winner === 'w' ? 'White wins!' : 'Black wins!')
          }
          break
        }
      }
    }
  }, [socket, chess, isLocalMode])

  const youAreText = useMemo(() => {
    if (isLocalMode) return 'Local pass-and-play'
    if (!playerColor) return 'Color assigned when match starts'
    return playerColor === 'w' ? 'You are White' : 'You are Black'
  }, [playerColor, isLocalMode])

  if (!isLocalMode && !socket) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-4 animate-fade-in">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-slate-700" />
            <div className="absolute inset-0 rounded-full border-4 border-green-400 border-t-transparent animate-spin" />
          </div>
          <p className="text-slate-400 text-lg font-medium">Connecting to server...</p>
          <p className="text-slate-600 text-sm">This may take a moment</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-screen min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="fixed inset-0 opacity-[0.03]" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
        backgroundSize: '40px 40px',
      }} />

      <div className="relative z-10 flex flex-col lg:flex-row items-center lg:items-start justify-center gap-8 lg:gap-12 p-6 lg:p-12">
        <div className="animate-slide-in-left">
          <div className="mb-4">
            <h2 className="text-slate-400 text-sm font-medium uppercase tracking-wider">Game Board</h2>
          </div>
          <ChessBoard
            chess={chess}
            socket={socket}
            board={board}
            setBoard={setBoard}
            canInteract={canMove}
            playerColor={playerColor}
            status={status}
          />
        </div>

        <div className="w-full max-w-sm animate-slide-in-right">
          <div className="glass rounded-2xl p-6 space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-display font-bold text-gradient mb-2">Chess Arena</h1>
              <StatusBadge status={status} />
            </div>

            {result && (
              <div className="animate-scale-in bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/30 rounded-xl p-4 text-center">
                <p className="text-amber-200 font-bold text-lg">{result}</p>
              </div>
            )}

            <div className="flex flex-col items-center gap-3">
              {!isLocalMode && status === 'idle' && (
                <Button
                  onClick={() => {
                    socket?.send(JSON.stringify({ type: INIT_GAME }))
                    setStatus('waiting')
                  }}
                >
                  Play Online
                </Button>
              )}

              {!isLocalMode && status === 'waiting' && (
                <div className="flex flex-col items-center gap-3 animate-fade-in">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <p className="text-slate-300 font-medium">Waiting for opponent...</p>
                  </div>
                  <p className="text-slate-500 text-sm">You will be matched shortly</p>
                </div>
              )}

              {status === 'playing' && (
                <div className="w-full space-y-4 animate-fade-in">
                  <div className="bg-slate-800/50 rounded-xl p-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <p className="text-slate-400 text-xs uppercase tracking-wider">Turn</p>
                      <p className="text-slate-400 text-xs">{youAreText}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${chess.turn() === 'w' ? 'bg-white border border-slate-400' : 'bg-slate-800 border border-slate-500'}`} />
                      <p className="text-white font-semibold">
                        {chess.turn() === 'w' ? 'White' : 'Black'} to move
                      </p>
                    </div>
                    {!canMove && !isLocalMode && (
                      <p className="text-slate-500 text-xs">Waiting for opponent move...</p>
                    )}
                  </div>

                  {chess.isCheck() && (
                    <div className="animate-scale-in bg-red-500/20 border border-red-500/30 rounded-xl p-3 text-center">
                      <p className="text-red-300 font-semibold">Check!</p>
                    </div>
                  )}
                </div>
              )}

              {status === 'over' && (
                <Button
                  onClick={() => {
                    chess.reset()
                    setBoard(chess.board())
                    setPlayerColor(null)
                    setResult(null)

                    if (isLocalMode) {
                      setStatus('playing')
                      return
                    }

                    socket?.send(JSON.stringify({ type: INIT_GAME }))
                    setStatus('waiting')
                  }}
                >
                  Play Again
                </Button>
              )}
            </div>

            {status === 'playing' && (
              <div className="border-t border-white/10 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Moves</span>
                  <span className="text-slate-300 font-mono">{Math.ceil(chess.moveNumber())}</span>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 glass rounded-xl p-4 animate-fade-in opacity-0" style={{ animationFillMode: 'forwards', animationDelay: '500ms' }}>
            <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-2">How to play</p>
            <p className="text-slate-400 text-sm leading-relaxed">
              Click one of your pieces, then click the destination square.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: GameStatus }) {
  const config = {
    idle: { text: 'Ready to Play', color: 'bg-slate-500/20 text-slate-400 border-slate-500/30' },
    waiting: { text: 'Finding Match...', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
    playing: { text: 'Game in Progress', color: 'bg-green-500/20 text-green-300 border-green-500/30' },
    over: { text: 'Game Over', color: 'bg-red-500/20 text-red-300 border-red-500/30' },
  }

  const { text, color } = config[status]

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${
        status === 'waiting' ? 'bg-amber-400 animate-pulse' :
        status === 'playing' ? 'bg-green-400' :
        status === 'over' ? 'bg-red-400' : 'bg-slate-400'
      }`} />
      {text}
    </span>
  )
}

export default Game
