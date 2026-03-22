import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import transactionRoutes from './routes/transaction.routes';
import goalRoutes from './routes/goal.routes';
import aiRoutes from './routes/ai.routes';
import passportRoutes from './routes/passport.routes';
import { errorHandler } from './middlewares/error.middleware';
import { generalLimiter, authLimiter } from './middlewares/rateLimit.middleware';

dotenv.config();

// Validate required env vars
const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
}

const app = express();
const PORT = process.env.PORT || 5000;

// Security & parsing middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(generalLimiter);

// Routes
app.use('/api/v1/auth', authLimiter, authRoutes);
app.use('/api/v1/transactions', transactionRoutes);
app.use('/api/v1/goals', goalRoutes);
app.use('/api/v1/ai', aiRoutes);
app.use('/api/v1/passport', passportRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'PayPath API is running' });
});

// Global error handler (must be last)
app.use(errorHandler as any);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
