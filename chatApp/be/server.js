import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

import authRoutes from './routes/authroutes.js';
import chatRoutes from './routes/chatroutes.js';
import Message from './models/message.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

// Middlewares
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: '*',  // Replace '*' with your frontend URL in production
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log('✅ User connected:', socket.id);

  socket.on('chat message', async ({ user, message }) => {
    try {
      console.log('📩 New message received:', { user, message });

      const newMessage = new Message({ user, message });
      await newMessage.save();

      io.emit('chat message', {
        user,
        message,
        timestamp: newMessage.timestamp,
      });
    } catch (err) {
      console.error('❌ Error saving message:', err.message);
    }
  });

  socket.on('disconnect', () => {
    console.log('❌ User disconnected:', socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
