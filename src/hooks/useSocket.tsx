import  {useEffect, useState} from 'react';

<<<<<<< HEAD
const web_url = 'https://chess-backend-yeir.onrender.com';
=======
const web_url = 'https://chess-backend-yeir.onrender.com'
>>>>>>> ba45f8ca806b5db248f2e1d4b376f3afedd58418

function useSocket() {
    const [socket, setSocket] = useState<WebSocket | null>(null);


useEffect(()=>{
    const ws = new WebSocket(web_url);
    ws.onopen = ()=>{
        console.log("connected");
        setSocket(ws);
    };

    ws.close = ()=>{
        console.log("disconnected");
        setSocket(null);
    };  

    return () => {
        ws.close();
    };
},[]);



  return socket;
  
}

export default useSocket
