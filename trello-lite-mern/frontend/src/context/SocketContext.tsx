// frontend/src/context/SocketContext.tsx
import React, { createContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '../hooks/useAuth';

interface SocketContextType {
  socket: Socket | null;
  connected: boolean;
}

export const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      const token = localStorage.getItem('accessToken');
      const socketURL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

      const newSocket = io(socketURL, {
        auth: { token },
        transports: ['websocket'],
      });

      newSocket.on('connect', () => {
        setConnected(true);
      });

      newSocket.on('disconnect', () => {
        setConnected(false);
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
        setConnected(false);
      }
    }
  }, [isAuthenticated]);

  return (
    <SocketContext.Provider value={{ socket, connected }}>
      {children}
    </SocketContext.Provider>
  );
};
