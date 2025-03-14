const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  // Initialize Socket.io
  const io = new Server(server);

  // Store active notifications
  const notifications = [];
  const MAX_NOTIFICATIONS = 50;

  // Socket.io connection handler
  io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);

    // Send existing notifications to the newly connected client
    socket.emit('notifications', notifications);

    // Handle user authentication
    socket.on('authenticate', (userId) => {
      if (userId) {
        socket.join(`user:${userId}`);
        console.log(`User ${userId} authenticated`);
      }
    });

    // Handle mark notification as read
    socket.on('markAsRead', (notificationId) => {
      const notification = notifications.find(n => n.id === notificationId);
      if (notification) {
        notification.read = true;
        io.emit('notificationUpdate', notification);
      }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });

  // Function to send a notification
  global.sendNotification = (notification) => {
    const newNotification = {
      id: Math.random().toString(36).substring(2, 15),
      timestamp: new Date(),
      read: false,
      ...notification
    };

    // Add to notifications array
    notifications.unshift(newNotification);
    
    // Limit the number of stored notifications
    if (notifications.length > MAX_NOTIFICATIONS) {
      notifications.pop();
    }

    // Send to all clients or specific user
    if (notification.userId) {
      io.to(`user:${notification.userId}`).emit('notification', newNotification);
    } else {
      io.emit('notification', newNotification);
    }

    return newNotification;
  };

  // Start the server on default port 3000
  const PORT = 3000;
  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${PORT}`);
  });
});
