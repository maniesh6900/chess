import {  Color, PieceSymbol, Square } from 'chess.js'
import { useState } from 'react';
import { MOVE } from '../screen/Game';


function ChessBoard({chess ,board, socket, setBoard}: {
  chess : any;
  setBoard: any;
  board : ({
    square: Square,
    type : PieceSymbol,
    color : Color
  } | null )[][];
  socket : WebSocket;
} ) {

  const [from, setFrom ] = useState<Square | null>(null);
  const [to, setTo] = useState<Square | null>(null);
  console.log(to);
  
  return (
    <div>
      {board.map((row, i) => (
        <div key={i} className='flex'>
          {row.map((square, j) => {
            const squareRespresntation  = String.fromCharCode(97 + (j % 8)) + "" + (8 - i) as Square
           return <div 
            onClick={()=> {
              if(!from){
                setFrom(squareRespresntation)
                }else{
                  setTo(squareRespresntation)
                  socket.send(JSON.stringify({
                    type: MOVE,
                    payload: {
                      move : {
                        from,
                        to: squareRespresntation
                      }}
                    }))
                    chess.move({
                      from,
                      to: squareRespresntation
                    })
                    setBoard(chess.board())
                    setFrom(null)
                }
              }}
              key={j} className={`w-16 h-16 ${(i + j) % 2 === 0 ? "bg-green-800"  : " bg-white"}`
            }>
              <div className='w-full flex justify-center h-full'>
                <div className="h-full w-full justify-center flex items-center">
                  {square ? <img className={`w-10 `}  alt='chessPieces'
                     src={`/${square.color === "b" ? 
                     square?.type : `${square?.type?.toUpperCase()} copy`}.png`}  /> 
                    : null}
                </div>
              </div>
            </div>
          })}
        </div>
      ))}
    </div>
  )
}

export default ChessBoard