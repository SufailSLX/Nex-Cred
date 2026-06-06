import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import Credit from './models/Credit.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Get all credits
app.get('/api/credits', async (req, res) => {
  const credits = await Credit.find().sort({ updatedAt: -1 });
  res.json(credits);
});

// Add new credit
app.post('/api/credits', async (req, res) => {
  const newCredit = await Credit.create(req.body);
  res.json(newCredit);
});

// Toggle Paid Status
app.put('/api/credits/:id', async (req, res) => {
  const { isPaid } = req.body;
  const updated = await Credit.findByIdAndUpdate(req.params.id, { isPaid }, { new: true });
  res.json(updated);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));