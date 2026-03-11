import http from 'http';
import app from './app.js';
import { initializeSocket } from './socket/index.js';

const PORT = process.env.CHAT_SERVICE_PORT || 4001;

const server = http.createServer(app);

// Initialize Socket.io on the HTTP server
initializeSocket(server);

server.listen(PORT, () => {
  console.log(`Chat microservice running on port ${PORT}`);
});
