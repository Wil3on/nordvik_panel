import { Server as NetServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { NextApiRequest } from 'next';
import { NextApiResponse } from 'next';

export type NextApiResponseWithSocket = NextApiResponse & {
  socket: {
    server: NetServer & {
      io?: SocketIOServer;
    };
  };
};

export const initSocket = (req: NextApiRequest, res: NextApiResponseWithSocket) => {
  if (!res.socket.server.io) {
    console.log('Initializing Socket.io server...');
    
    // Create a new Socket.io server
    const io = new SocketIOServer(res.socket.server);
    
    // Store the Socket.io server instance
    res.socket.server.io = io;
    
    // Set up event handlers
    io.on('connection', (socket) => {
      console.log(`Client connected: ${socket.id}`);
      
      // Send a welcome message to the client
      socket.emit('notification', {
        type: 'INFO',
        message: 'Connected to Nordvik Panel',
        timestamp: new Date(),
      });
      
      // Handle disconnect
      socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
      });
    });
  }
  
  return res.socket.server.io;
};

export interface Notification {
  id: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  message: string;
  timestamp: Date;
  read: boolean;
  link?: string;
  userId?: string;
}

// Function to send a notification to all connected clients or specific user
export const sendNotification = (
  io: SocketIOServer,
  notification: Omit<Notification, 'id' | 'read'>,
  userId?: string
) => {
  const fullNotification: Notification = {
    ...notification,
    id: Math.random().toString(36).substring(2, 15),
    read: false,
  };
  
  if (userId) {
    // Send to specific user
    io.to(`user:${userId}`).emit('notification', fullNotification);
  } else {
    // Send to all connected clients
    io.emit('notification', fullNotification);
  }
  
  return fullNotification;
};
