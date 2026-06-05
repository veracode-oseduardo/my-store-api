# my-store-api

# My Store API

**Demo API for authentication, orders and products management.**

This repository contains **My Store API**, a small backend service that helps a simple online store manage **users**, **products**, and **orders**. The API is intended for development and testing and exposes endpoints for authentication, product catalog management, and order processing.

> From the API specification: "Demo API for authentication, orders and products management."  
> From the API specification: "Public endpoint listing products."

---

## Overview

**What this project does**  
- Lets users sign in and receive a temporary token.  
- Lets anyone list and view products.  
- Lets authenticated users place orders.  
- Lets administrators create, update, and delete products.

**Who should read this README**  
- Developers who will run or modify the service.  
- Testers who need to exercise the API.  
- Non-technical team members who want a clear, plain-language description of how the service works.

---

## Project layout (simple terms)

- **`routes/`** — API endpoints (for example `routes/products.routes.js` handles `/api/products`).  
- **`db/`** — Database helpers: open/close connections and run queries.  
- **`middleware/`** — Small checks that run before route handlers (authentication, admin checks).  
- **`app.js` or `server.js`** — Starts the server and wires routes and middleware together.  
- **`package.json`** — Project metadata and scripts (`npm install`, `npm start`).  
- **Environment variables** — `PORT`, `DATABASE_URL`, `JWT_SECRET` control runtime behavior.

---

## Product endpoints (what they do)

- **`GET /api/products`**  
  Returns the list of products. The specification notes that production should support pagination (`limit`, `offset`) so the API remains fast with many items.

- **`GET /api/products/{id}`**  
  Returns details for a single product by numeric ID. Returns `404` if the product does not exist.

- **`POST /api/products`** — *Admin only*  
  Creates a new product. Request body must include `name`, `price`, and `stock`. Requires a valid admin token.

- **`PUT /api/products/{id}`** — *Admin only*  
  Updates one or more fields of an existing product. Returns `404` if the product does not exist.

- **`DELETE /api/products/{id}`** — *Admin only*  
  Deletes the product and returns the deleted product in the response. Returns `404` if the product does not exist.

---

## Quick start (run locally)

# To run it manually

npm install
npm run migrate
npm run seed
npm start

# To run it with docker compose

docker compose up --build -d

