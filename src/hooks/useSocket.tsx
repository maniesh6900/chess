import { useEffect, useState } from 'react';

const DEFAULT_WS_URL = 'wss://chess-backend-yeir.onrender.com';

function normalizeWebSocketUrl(rawUrl: string): string {
  if (rawUrl.startsWith('https://')) return rawUrl.replace('https://', 'wss://');
  if (rawUrl.startsWith('http://')) return rawUrl.replace('http://', 'ws://');
  return rawUrl;
}

function useSocket(enabled = true) {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    if (!enabled) {
      setSocket(null);
      return;
    }

    const configuredUrl = import.meta.env.VITE_WS_URL ?? DEFAULT_WS_URL;
    const wsUrl = normalizeWebSocketUrl(configuredUrl);
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      setSocket(ws);
    };

    ws.onclose = () => {
      setSocket(null);
    };

    return () => {
      ws.close();
    };
  }, [enabled]);

  return socket;
}

export default useSocket;
