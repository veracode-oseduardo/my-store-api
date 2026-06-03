// routes/orders.routes.js
import express from 'express';
import { getDb } from '../db/database.js';
import { authRequired } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authRequired, (req, res) => {
  const userId = req.user.id;
  const db = getDb();
  const orders = db.prepare('SELECT id, userId, total, createdAt FROM orders WHERE userId = ?').all(userId);
  const detailed = orders.map(o => {
    const items = db.prepare('SELECT productId, name, quantity, price, lineTotal FROM order_items WHERE orderId = ?').all(o.id);
    return { ...o, items };
  });
  db.close();
  res.json(detailed);
});

router.post('/', authRequired, (req, res) => {
  const userId = req.user.id;
  const { items } = req.body;
  if (!Array.isArray(items) || items.length === 0) return res.status(400).json({ message: 'Items are required' });

  const db = getDb();
  const tx = db.transaction((items) => {
    let total = 0;
    const detailedItems = [];

    for (const it of items) {
      const product = db.prepare('SELECT id, name, price, stock FROM products WHERE id = ?').get(it.productId);
      if (!product) throw new Error(`Product ${it.productId} does not exist`);
      if (product.stock < it.quantity) throw new Error(`Insuficient stock of ${product.name}`);

      const lineTotal = product.price * it.quantity;
      total += lineTotal;
      detailedItems.push({ productId: product.id, name: product.name, quantity: it.quantity, price: product.price, lineTotal });

      db.prepare('UPDATE products SET stock = stock - ? WHERE id = ?').run(it.quantity, product.id);
    }

    const info = db.prepare('INSERT INTO orders (userId, total, createdAt) VALUES (?, ?, ?)').run(userId, total, new Date().toISOString());
    const orderId = info.lastInsertRowid;

    for (const di of detailedItems) {
      db.prepare('INSERT INTO order_items (orderId, productId, name, quantity, price, lineTotal) VALUES (?, ?, ?, ?, ?, ?)')
        .run(orderId, di.productId, di.name, di.quantity, di.price, di.lineTotal);
    }

    return { id: orderId, userId, items: detailedItems, total, createdAt: new Date().toISOString() };
  });

  try {
    const newOrder = tx(items);
    db.close();
    res.status(201).json(newOrder);
  } catch (err) {
    db.close();
    res.status(400).json({ message: err.message });
  }
});

export default router;
