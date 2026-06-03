// data/db.js

// Sample users (password: "123456" in plain text only for demo)
export const users = [
  { id: 1, username: 'admin', passwordHash: null, role: 'admin' },
  { id: 2, username: 'client', passwordHash: null, role: 'customer' }
];

// Sample products
export let products = [
  { id: 1, name: 'Laptop', price: 1200, stock: 10 },
  { id: 2, name: 'Mouse', price: 25, stock: 100 }
];

// Orders
export let orders = [];
