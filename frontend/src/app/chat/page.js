'use client';

import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

// Use environment variable or default to the microservice port
const SOCKET_URL = process.env.NEXT_PUBLIC_CHAT_SERVICE_URL || 'http://localhost:4001';

export default  function ChatPage() {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [roomId, setRoomId] = useState('general');
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // 1. Fetch the JWT from localStorage
    const token = localStorage.getItem('token'); 
    if (!token) {
      console.error("No token found. User might not be logged in.");
      // Optional: Add routing to redirect to login page here
      return;
    }

    // 2. Initialize the socket connection to the chat microservice
    const newSocket = io(SOCKET_URL, {
      auth: {
        token: token,
      },
    });

    // 3. Set up event listeners
    newSocket.on('connect', () => {
      console.log('Connected to chat server!', newSocket.id);
      setIsConnected(true);
      newSocket.emit('join_room', roomId);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from chat server');
      setIsConnected(false);
    });

    // Listen for incoming messages broadcasted from the backend
    newSocket.on('receive_message', (data) => {
      console.log('Message received:', data);
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    setSocket(newSocket);

    // 4. Cleanup function: disconnect when the component unmounts
    return () => {
      newSocket.disconnect();
    };
  }, [roomId]); // Re-run if the room changes

  const sendMessage = (e) => {
    e.preventDefault();
    if (inputMessage.trim() && socket) {
      const messageData = {
        roomId: roomId,
        message: inputMessage,
        // The senderId will be handled by the backend's JWT decoding
      };

      // Emit to the backend messageHandler
      socket.emit('send_message', messageData, (response) => {
        if (response.status === 'success') {
          console.log('Message sent successfully confirmed by backend');
        }
      });

      // Optimistically add the message to our own UI
      setMessages((prev) => [...prev, { senderId: 'Me', message: inputMessage }]);
      setInputMessage('');
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto p-4 bg-gray-50">
      <div className="bg-white p-4 rounded-t-lg shadow-sm border-b flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">Global Chat ({roomId})</h1>
        <div className="flex items-center">
          <div className={`w-3 h-3 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-sm text-gray-500">{isConnected ? 'Connected' : 'Disconnected'}</span>
        </div>
      </div>

      <div className="flex-1 bg-white p-4 overflow-y-auto border-x border-gray-200">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-gray-400 mt-10">No messages yet. Start chatting!</div>
          ) : (
            messages.map((msg, index) => (
              <div 
                key={index} 
                className={`flex flex-col ${msg.senderId === 'Me' ? 'items-end' : 'items-start'}`}
              >
                <div 
                  className={`max-w-[70%] rounded-lg p-3 ${
                    msg.senderId === 'Me' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  <div className="text-xs opacity-75 mb-1">{msg.senderId === 'Me' ? 'You' : msg.senderId}</div>
                  <div>{msg.message}</div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="bg-white p-4 rounded-b-lg shadow-sm border border-t-0">
        <form onSubmit={sendMessage} className="flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500 text-black"
            disabled={!isConnected}
          />
          <button
            type="submit"
            disabled={!isConnected || !inputMessage.trim()}
            className="px-6 py-2 bg-blue-500 text-white rounded-full font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
