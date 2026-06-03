// routes/products.routes.js
import express from 'express';
import { getDb } from '../db/database.js';
import { authRequired, isAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', (req, res) => {
  const db = getDb();
  const rows = db.prepare('SELECT id, name, price, stock FROM products').all();
  db.close();
  res.json(rows);
});

router.get('/:id', (req, res) => {
  const id = Number(req.params.id);
  const db = getDb();
  const product = db.prepare('SELECT id, name, price, stock FROM products WHERE id = ?').get(id);
  db.close();
  if (!product) return res.status(404).json({ message: 'Product does not exist' });
  res.json(product);
});

router.post('/', authRequired, isAdmin, (req, res) => {
  const { name, price, stock } = req.body;
  if (!name || price == null || stock == null) return res.status(400).json({ message: 'name, price and stock are required fields' });

  const db = getDb();
  const info = db.prepare('INSERT INTO products (name, price, stock) VALUES (?, ?, ?)').run(name, price, stock);
  const product = db.prepare('SELECT id, name, price, stock FROM products WHERE id = ?').get(info.lastInsertRowid);
  db.close();
  res.status(201).json(product);
});

router.put('/:id', authRequired, isAdmin, (req, res) => {
  const id = Number(req.params.id);
  const { name, price, stock } = req.body;
  const db = getDb();
  const product = db.prepare('SELECT id FROM products WHERE id = ?').get(id);
  if (!product) { db.close(); return res.status(404).json({ message: 'Product does not exist' }); }

  db.prepare('UPDATE products SET name = COALESCE(?, name), price = COALESCE(?, price), stock = COALESCE(?, stock) WHERE id = ?')
    .run(name, price, stock, id);
  const updated = db.prepare('SELECT id, name, price, stock FROM products WHERE id = ?').get(id);
  db.close();
  res.json(updated);
});

router.delete('/:id', authRequired, isAdmin, (req, res) => {
  const id = Number(req.params.id);
  const db = getDb();
  const product = db.prepare('SELECT id, name, price, stock FROM products WHERE id = ?').get(id);
  if (!product) { db.close(); return res.status(404).json({ message: 'Product does not exist' }); }
  db.prepare('DELETE FROM products WHERE id = ?').run(id);
  db.close();
  res.json(product);
});

export default router;
