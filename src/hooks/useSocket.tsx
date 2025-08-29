import  {useEffect, useState} from 'react';

const web_url = 'https://chess-backend-yeir.onrender.com';

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
