// routes/products.routes.js
import express from 'express';
import { products } from '../data/db.js';
import { authRequired, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// List products (public or authenticated)
router.get('/', (req, res) => {
  res.json(products);
});

// Get product by id
router.get('/:id', (req, res) => {
  const id = Number(req.params.id);
  const product = products.find(p => p.id === id);
  if (!product) return res.status(404).json({ message: 'Product does not exist' });
  res.json(product);
});

// Crea a product (only admin user)
router.post('/', authRequired, isAdmin, (req, res) => {
  const { name, price, stock } = req.body;
  if (!name || price == null || stock == null) {
    return res.status(400).json({ message: 'name, price and stock are required' });
  }

  const newProduct = {
    id: products.length ? Math.max(...products.map(p => p.id)) + 1 : 1,
    name,
    price,
    stock
  };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

// Update a product (only admin user)
router.put('/:id', authRequired, isAdmin, (req, res) => {
  const id = Number(req.params.id);
  const product = products.find(p => p.id === id);
  if (!product) return res.status(404).json({ message: 'Product does not exist' });

  const { name, price, stock } = req.body;
  if (name !== undefined) product.name = name;
  if (price !== undefined) product.price = price;
  if (stock !== undefined) product.stock = stock;

  res.json(product);
});

// Delete a product (only admin user)
router.delete('/:id', authRequired, isAdmin, (req, res) => {
  const id = Number(req.params.id);
  const index = products.findIndex(p => p.id === id);
  if (index === -1) return res.status(404).json({ message: 'Product does not exist' });

  const deleted = products.splice(index, 1)[0];
  res.json(deleted);
});

export default router;
