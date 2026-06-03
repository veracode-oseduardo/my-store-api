// routes/orders.routes.js
import express from 'express';
import { orders, products } from '../data/db.js';
import { authRequired } from '../middleware/auth.js';

const router = express.Router();

// Listar órdenes del usuario autenticado
router.get('/', authRequired, (req, res) => {
  const userId = req.user.id;
  const userOrders = orders.filter(o => o.userId === userId);
  res.json(userOrders);
});

// Crear una orden (compra)
router.post('/', authRequired, (req, res) => {
  const userId = req.user.id;
  const { items } = req.body;
  // items: [{ productId, quantity }, ...]

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'items es requerido y debe ser un array' });
  }

  let total = 0;
  const detailedItems = [];

  for (const item of items) {
    const product = products.find(p => p.id === item.productId);
    if (!product) {
      return res.status(400).json({ message: `Producto ${item.productId} no existe` });
    }
    if (product.stock < item.quantity) {
      return res.status(400).json({ message: `Stock insuficiente para producto ${product.name}` });
    }

    const lineTotal = product.price * item.quantity;
    total += lineTotal;
    detailedItems.push({
      productId: product.id,
      name: product.name,
      quantity: item.quantity,
      price: product.price,
      lineTotal
    });
  }

  // Descontar stock
  for (const item of items) {
    const product = products.find(p => p.id === item.productId);
    product.stock -= item.quantity;
  }

  const newOrder = {
    id: orders.length ? Math.max(...orders.map(o => o.id)) + 1 : 1,
    userId,
    items: detailedItems,
    total,
    createdAt: new Date().toISOString()
  };

  orders.push(newOrder);
  res.status(201).json(newOrder);
});

export default router;
