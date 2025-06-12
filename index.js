import express from'express';
import mongoose from'mongoose';
import cors from'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js'
import examRoutes from './routes/examRoutes.js '
import resultRoutes from './routes/resultRoutes.js'

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth',authRoutes);
app.use('/api/exams',examRoutes);
app.use('/api/results', resultRoutes);

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => app.listen(3000, () => console.log('Server running on port 3000')))
.catch(err => console.log(err));
