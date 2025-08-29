import { useEffect, useState, } from "react"
import Boarder from "../components/Board"
import Button from "../components/Button"
import useSocket from "../hooks/useSocket"
import { Chess } from "chess.js"


//message types for WebSokcet
export const INIT_GAME = "init_game"
export const MOVE = "move"
export const GAME_OVER = "game_over"

function Game() {

  const socket = useSocket()
  const [chess, setChess] = useState(new Chess())
  const [board, setBoard] = useState(chess.board())

  useEffect(() => {
    if (!socket){
      return;
    } 
     setChess && console.log(setChess);
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data)
      console.log(message);
      
      switch (message.type) {
        case INIT_GAME:
          setBoard(chess.board())
          console.log("game initialzed");
          break;

        case MOVE:
          const move = message.payload;
          chess.move(move)
          setBoard(chess.board())
          console.log("move has made");
          break;

        case GAME_OVER:
          console.log("game over");
          break;
      }
    }

  }, [socket])

  if (!socket) {
    return <div>Connecting...</div>
  }

  return (
    <div className="w-screen h-screen bg-slate-900">
      <div className="flex h-full w-full">
        <div className="w-1/2 h-full flex mt-10 justify-center ">
          <Boarder chess={chess} socket={socket} board={board} setBoard={setBoard}  />
        </div>
        <div className="h-3/5 p-2 w-1/4 mt-10 bg-slate-600 flex justify-center rounded ">
          <div
            className="bg-green-500 text-white mt-2 h-12 p-2 w-2/12 text-3xl font-bold rounded-md flex justify-center items-center"
            >
            <Button 
            onClick={() => {
              socket.send(JSON.stringify({
                type: INIT_GAME
              }))
            }}>
              PLAY
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Game