// routes/orders.routes.js
import express from 'express';
import { getDb } from '../db/database.js';
import { authRequired } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authRequired, async (req, res) => {
  //const userId = req.user.id;
  const db = await getDb();
  const orders = await db.all('SELECT id, userId, total, createdAt FROM orders WHERE userId = ?', req.user.id);
  const detailed = await Promise.all(orders.map(async (o) => {
    const items = await db.all('SELECT productId, name, quantity, price, lineTotal FROM order_items WHERE orderId = ?', o.id);
    return { ...o, items };
  }));
  await db.close();
  res.json(detailed);
});

router.post('/', authRequired, async (req, res) => {
  const userId = req.user.id;
  const { items } = req.body;
  if (!Array.isArray(items) || items.length === 0) return res.status(400).json({ message: 'Items are required' });

  const db = await getDb();
  try {
    await db.run('BEGIN TRANSACTION');
    let total = 0;
    const detailedItems = [];

    for (const it of items) {
      const product = await db.get('SELECT id, name, price, stock FROM products WHERE id = ?', it.productId);
      if (!product) throw new Error(`Product ${it.productId} does not exist`);
      if (product.stock < it.quantity) throw new Error(`Insuficient stock of ${product.name}`);

      const lineTotal = product.price * it.quantity;
      total += lineTotal;
      detailedItems.push({ productId: product.id, name: product.name, quantity: it.quantity, price: product.price, lineTotal });

      await db.run('UPDATE products SET stock = stock - ? WHERE id = ?', it.quantity, product.id);
    }

    const info = await db.run('INSERT INTO orders (userId, total, createdAt) VALUES (?, ?, ?)', userId, total, new Date().toISOString());
    const orderId = info.lastID;

    for (const di of detailedItems) {
      await db.run('INSERT INTO order_items (orderId, productId, name, quantity, price, lineTotal) VALUES (?, ?, ?, ?, ?, ?)', orderId, di.productId, di.name, di.quantity, di.price, di.lineTotal);
    }

    await db.run('COMMIT');
    await db.close();
    res.status(201).json({ id: orderId, userId, items: detailedItems, total, createdAt: new Date().toISOString() });
  } catch (err) {
    await db.run('ROLLBACK');
    await db.close();
    res.status(400).json({ message: err.message });
  }
});

export default router;
