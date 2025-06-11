import express from 'express';
import { getMessages, sendMessage } from '../controllers/chatcontroller.js';

const router = express.Router();

router.get('/messages', getMessages);    // GET chat history
router.post('/send', sendMessage);       // POST new message via API

export default router;
