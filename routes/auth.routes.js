// routes/auth.routes.js
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { users } from '../data/db.js';
import { JWT_SECRET } from '../config.js';

const router = express.Router();

// Inicializar hashes de ejemplo (solo demo)
let initialized = false;
function initUsers() {
  if (initialized) return;
  users.forEach(u => {
    if (!u.passwordHash) {
      // password por defecto: "123456"
      u.passwordHash = bcrypt.hashSync('123456', 10);
    }
  });
  initialized = true;
}

router.post('/login', async (req, res) => {
  initUsers();
  const { username, password } = req.body;

  const user = users.find(u => u.username === username);
  if (!user) return res.status(401).json({ message: 'Credenciales inválidas' });

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) return res.status(401).json({ message: 'Credenciales inválidas' });

  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: '60s' }
  );

  res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
});

export default router;
