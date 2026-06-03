// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import productsRoutes from './routes/products.routes.js';
import ordersRoutes from './routes/orders.routes.js';
import { SERVER } from './config.js';
import { PORT } from './config.js';
import { requestLogger } from './utils/logger.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(requestLogger);

app.use('/api/auth', authRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/orders', ordersRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

app.listen(PORT, () => console.log(`API listening in http://${SERVER}:${PORT}`));
