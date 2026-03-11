import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

// Health check endpoint for the microservice
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', service: 'chat-services' });
});

export default app;
