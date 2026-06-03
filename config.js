// config.js
import dotenv from 'dotenv';
dotenv.config();

export const JWT_SECRET = process.env.JWT_SECRET || 'b9f3e7a4c2d1f8e6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2';
export const SERVER = process.env.SERVER || 'localhost';
export const PORT = process.env.PORT || 3000;
export const DB_FILE = process.env.DATABASE_FILE || './data/mi_tienda.db';