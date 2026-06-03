// routes/auth.routes.js
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getDb } from '../db/database.js';
import { JWT_SECRET } from '../config.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'username and password are required' });

  const db = getDb();
  const row = db.prepare('SELECT id, username, passwordHash, role FROM users WHERE username = ?').get(username);
  db.close();

  if (!row) return res.status(401).json({ message: 'MSG1: Invalid credentials' });

  //const valid = await bcrypt.compare(password, row.passwordHash);
  const valid = await (password === row.passwordHash);
  if (!valid) return res.status(401).json({ message: 'MSG2: Invalid credentials' });

  const token = jwt.sign({ id: row.id, username: row.username, role: row.role }, JWT_SECRET, { expiresIn: '60s' });
  res.json({ token, user: { id: row.id, username: row.username, role: row.role } });
});

export default router;

