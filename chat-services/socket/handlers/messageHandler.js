// Import chat service for business logic/DB operations
// import * as chatService from '../../services/chatService.js';

export default function registerMessageHandlers(io, socket) {
  // Listen for 'send_message' event
  socket.on('send_message', async (data, callback) => {
    try {
      console.log(`Message received from ${socket.id}:`, data);
      
      const { roomId, message } = data;

      // 1. Save to database using chatService
      // const savedMessage = await chatService.saveMessage(roomId, socket.user.id, message);

      // 2. Broadcast message to all users in the specific room EXCEPT the sender
      socket.to(roomId).emit('receive_message', {
        senderId: socket.user.username, // or socket.user.id
        message
      });

      // 3. Acknowledge success to the sender
      if (typeof callback === 'function') {
        callback({ status: 'success' });
      }
    } catch (error) {
      console.error('Error handling send_message:', error);
      if (typeof callback === 'function') {
        callback({ status: 'error', error: error.message });
      }
    }
  });

  // Handle joining a room
  socket.on('join_room', (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  // Handle typing indicator
  socket.on('typing', ({ roomId, isTyping }) => {
    socket.to(roomId).emit('user_typing', {
      userId: socket.id,
      isTyping
    });
  });
}
