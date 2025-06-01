import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socketInstance = io(import.meta.env.VITE_SERVER_URL || 'http://localhost:3000', {
      withCredentials: true,
    });

    socketInstance.on('connect', () => {
      console.log('Connected to socket server');
      setIsConnected(true);
    });

    socketInstance.on('disconnect', () => {
      console.log('Disconnected from socket server');
      setIsConnected(false);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);


  const leaveRoom = (roomId) => {
    if (socket) {
      socket.emit('leave-room', roomId);
    }
  };

  const sendStream = (stream, roomId) => {
    if (socket) {
      socket.emit('stream', stream, roomId);
    }
  };

  const sendMessage = (message, roomId) => {
    if (socket) {
      socket.emit('send-message', message, roomId);
    }
  };

  const updateUserStatus = (status, roomId) => {
    if (socket) {
      socket.emit('user-status', status, roomId);
    }
  };

  const value = {
    socket,
    isConnected,
    leaveRoom,
    sendStream,
    sendMessage,
    updateUserStatus,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
}; 