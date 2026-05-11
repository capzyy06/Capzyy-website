# Capzyy — Caps Only E-Commerce

Premium caps-only store for Instagram page [@capzyy](https://instagram.com/capzyy).  
Built with the **MERN Stack** — MongoDB, Express, React, Node.js.

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Cloudinary account

### 1. Clone & Install

```bash
# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

### 2. Environment Variables

```bash
# Server
cp server/.env.example server/.env
# Fill in MONGO_URI, JWT_SECRET, CLOUDINARY_* values

# Client
cp client/.env.example client/.env
# Fill in VITE_API_BASE_URL
```

### 3. Seed Database

```bash
cd server && npm run seed
# Creates categories + admin user: admin@capzyy.com / capzyy@admin123
```

### 4. Run Development

```bash
# Terminal 1 — Backend
cd server && npm run dev

# Terminal 2 — Frontend
cd client && npm run dev
```

Frontend: http://localhost:5173  
Backend API: http://localhost:5000  
Admin Panel: http://localhost:5173/admin

---

## 📁 Project Structure

```
capzyy/
├── client/          # React + Vite frontend
└── server/          # Node.js + Express backend
```

## 🧢 Features (v1.0)

- Full product catalogue — caps only
- Filter by category, price
- Product detail with image gallery & variants
- Cart with persistent state (localStorage)
- Full checkout form → order creation
- Order confirmation page
- Admin panel: products, categories, orders, image upload

## 🔐 Admin Access

After running seed: `admin@capzyy.com` / `capzyy@admin123`  
Admin panel URL: `/admin`

## 🌐 Deployment

| Service | Platform |
|---------|----------|
| Frontend | Vercel |
| Backend | Render |
| Database | MongoDB Atlas |
| Images | Cloudinary |

---

*Capzyy — Caps Only. No Compromise.*
