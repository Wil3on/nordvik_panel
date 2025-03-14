import { NextRequest } from 'next/server';
import { initSocket, NextApiResponseWithSocket, sendNotification } from '@/lib/socket';

export async function GET(req: NextRequest, res: NextApiResponseWithSocket) {
  try {
    // Initialize Socket.io server
    const io = initSocket(req as any, res);
    
    // Send a test notification to all connected clients
    sendNotification(io, {
      type: 'INFO',
      message: 'Socket.io server is running',
      timestamp: new Date(),
    });
    
    return new Response('Socket.io server initialized', { status: 200 });
  } catch (error) {
    console.error('Error initializing Socket.io server:', error);
    return new Response('Error initializing Socket.io server', { status: 500 });
  }
}
