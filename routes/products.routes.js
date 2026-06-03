// routes/products.routes.js
import express from 'express';
import { products } from '../data/db.js';
import { authRequired, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Listar productos (público o autenticado, según prefieras)
router.get('/', (req, res) => {
  res.json(products);
});

// Consultar producto por id
router.get('/:id', (req, res) => {
  const id = Number(req.params.id);
  const product = products.find(p => p.id === id);
  if (!product) return res.status(404).json({ message: 'Producto no encontrado' });
  res.json(product);
});

// Crear producto (solo admin)
router.post('/', authRequired, isAdmin, (req, res) => {
  const { name, price, stock } = req.body;
  if (!name || price == null || stock == null) {
    return res.status(400).json({ message: 'name, price y stock son requeridos' });
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

// Actualizar producto (solo admin)
router.put('/:id', authRequired, isAdmin, (req, res) => {
  const id = Number(req.params.id);
  const product = products.find(p => p.id === id);
  if (!product) return res.status(404).json({ message: 'Producto no encontrado' });

  const { name, price, stock } = req.body;
  if (name !== undefined) product.name = name;
  if (price !== undefined) product.price = price;
  if (stock !== undefined) product.stock = stock;

  res.json(product);
});

// Eliminar producto (solo admin)
router.delete('/:id', authRequired, isAdmin, (req, res) => {
  const id = Number(req.params.id);
  const index = products.findIndex(p => p.id === id);
  if (index === -1) return res.status(404).json({ message: 'Producto no encontrado' });

  const deleted = products.splice(index, 1)[0];
  res.json(deleted);
});

export default router;
