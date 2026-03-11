import { Server } from 'socket.io';
import registerMessageHandlers from './handlers/messageHandler.js';
// import { createAdapter } from '@socket.io/redis-adapter';
// import redisClient from '../config/redis.js';

let io;

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: '*', // update to your frontend URL
      methods: ['GET', 'POST']
    }
  });

  // Example: Use Redis Adapter if scaling horizontally across multiple microservice instances
  // const pubClient = redisClient.duplicate();
  // const subClient = redisClient.duplicate();
  // io.adapter(createAdapter(pubClient, subClient));

  // Middleware for Authentication
  io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;

    if (token) {
      try {
        const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:4000';
        const response = await fetch(`${AUTH_SERVICE_URL}/auth/verify`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!response.ok) {
          return next(new Error('Authentication error: Invalid or expired token'));
        }

        const data = await response.json();
        socket.user = data.user;
        return next();
      } catch (error) {
        console.error("Auth verify error:", error);
        return next(new Error('Authentication error: Auth service unreachable'));
      }
    }
    return next(new Error('Authentication error: Token missing'));


  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.user.username}`);

    // Register event handlers
    registerMessageHandlers(io, socket);

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.user.username}`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io is not initialized!');
  }
  return io;
};
