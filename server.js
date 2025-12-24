// server.js
import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import userRoutes from './routes/User.js';
import productRoutes from './routes/Product.js';
import EventRoutes from './routes/Event.js';
import cors from 'cors';
import categoryRoutes from './routes/Category.js'
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
//app.use(cors({
  //origin: ["http://localhost:4173", "http://localhost:5174"],
  //credentials: true,
//}))

app.use(cors());

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//db Connexion
const connectDB = async () => {
    try {
      await mongoose.connect(process.env.MONGO_URI);
  
      console.log(`✅ MongoDB connected: ${mongoose.connection.host}`);
    } catch (error) {
      console.error('❌ MongoDB connection error:', error.message);
      process.exit(1);
    }
  };

// Routes
app.use('/users', userRoutes);
app.use('/products', productRoutes);
app.use('/categories',categoryRoutes);
app.use('/events',EventRoutes);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
});
