// routes/products.routes.js
import express from 'express';
import { getDb } from '../db/database.js';
import { authRequired, isAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const db = await getDb();
  const rows = await db.all('SELECT id, name, price, stock FROM products');
  await db.close();
  res.json(rows);
});

router.get('/:id', async (req, res) => {
  const db = await getDb();
  try{
    const product = await db.get('SELECT id, name, price, stock FROM products WHERE id = ' + req.params.id);

    if (!product) return res.status(404).json({ message: 'Product does not exist' });
    res.status(200).json(product);
  }
  catch(err){
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
  finally{
    await db.close();
  }
});

router.post('/', authRequired, isAdmin, async (req, res) => {
  const { name, price, stock } = req.body;
  if (!name || price == null || stock == null) return res.status(400).json({ message: 'name, price and stock are required fields' });

  const db = await getDb();

  const info = await db.run('INSERT INTO products (name, price, stock) VALUES ("' + req.body.name + '", "' + req.body.price + '", "' + req.body.stock + '")');
  if (!info) { await db.close(); return res.status(5000).json({ message: 'Bad Request' }); }
  const product = await db.get('SELECT id, name, price, stock FROM products WHERE id = ?', info.lastID);
  await db.close();
  res.status(201).json(product);
});

router.put('/:id', authRequired, isAdmin, async (req, res) => {
  //const id = Number(req.params.id);
  const { name, price, stock } = req.body;
  const db = await getDb();
  //const product = await db.get('SELECT id FROM products WHERE id = ?', id);
  const product = await db.get('SELECT id FROM products WHERE id = ' + req.params.id);
  if (!product) { await db.close(); return res.status(404).json({ message: 'Product does not exist' }); }

  await db.run('UPDATE products SET name = COALESCE(?, name), price = COALESCE(?, price), stock = COALESCE(?, stock) WHERE id = ' + req.params.id, name, price, stock);
  //const updated = await db.get('SELECT id, name, price, stock FROM products WHERE id = ?', id);
  const updated = await db.get('SELECT id, name, price, stock FROM products WHERE id = ' + req.params.id);
  await db.close();
  res.status(200).json(updated);
});

router.delete('/:id', authRequired, isAdmin, async (req, res) => {
  //const id = Number(req.params.id);
  const db = await getDb();
  //const product = await db.get('SELECT id, name, price, stock FROM products WHERE id = ?', id);
  const product = await db.get('SELECT id, name, price, stock FROM products WHERE id = ', req.params.id);
  if (!product) { await db.close(); return res.status(404).json({ message: 'Product does not exist' }); }
  //await db.run('DELETE FROM products WHERE id = ?', id);
  await db.run('DELETE FROM products WHERE id = ', req.params.id);
  await db.close();
  res.status(200).json(product);
});

export default router;
