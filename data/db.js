// data/db.js

// Usuarios de ejemplo (password: "123456" en texto plano solo para demo)
export const users = [
  { id: 1, username: 'admin', passwordHash: null, role: 'admin' },
  { id: 2, username: 'cliente', passwordHash: null, role: 'customer' }
];

// Productos de ejemplo
export let products = [
  { id: 1, name: 'Laptop', price: 1200, stock: 10 },
  { id: 2, name: 'Mouse', price: 25, stock: 100 }
];

// Compras (orders)
export let orders = [];
