import Message from '../models/message.js';

// Get last 50 messages for chat history
export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find()
      .sort({ timestamp: 1 })  // oldest first
      .limit(50);
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get messages' });
  }
};

// Save a new message via REST API
export const sendMessage = async (req, res) => {
  const { user, message } = req.body;
  if (!user || !message) {
    return res.status(400).json({ message: 'User and message are required' });
  }

  try {
    const newMessage = new Message({ user, message });
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (err) {
    res.status(500).json({ message: 'Failed to send message' });
  }
};
