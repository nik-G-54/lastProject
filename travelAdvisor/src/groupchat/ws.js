import { io } from 'socket.io-client';

export function connectWS() {
    const url = import.meta.env.VITE_WS_URL || 'http://localhost:4600';
    return io(url, { transports: ['websocket', 'polling'] });
}
