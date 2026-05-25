# OpenRest

QR-based restaurant ordering system built with the MERN stack. Customers scan a code at their table, log in, and place orders from their phone. Orders show up on a kitchen dashboard in real time via WebSockets.

**Live demo:** https://openrest.vercel.app

---

## Stack

MongoDB · Express · React · Node.js · Socket.io · JWT · Vite

---

## Running locally

You'll need Node.js and MongoDB running on port 27017 (or swap in an Atlas URI).

```bash
# backend (runs on :8080)
cd backend
npm install
npm run dev

# frontend (runs on :5173)
cd frontend
npm install
npm run dev
```

On first run the database seeds itself with 15 menu items and 7 accounts.

---

## Demo accounts

| Username | Password | Role |
|----------|----------|------|
| staff1 | password123 | staff |
| table1 | table1pass | table |

---

## Pages

**Order page** — table accounts browse the menu, add items to cart, and submit. After submitting, a live tracking view shows the order status as staff update it.

**Kitchen dashboard** — staff-only. New orders appear automatically without refresh. Staff move orders through pending → preparing → ready → delivered.

**Menu manager** — staff-only. Full CRUD for menu items with category filtering.

---

## API

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | /api/auth/login | — | returns JWT |
| GET | /api/menu | — | list all items |
| POST | /api/menu | staff | add item |
| PUT | /api/menu/:id | staff | edit item |
| DELETE | /api/menu/:id | staff | delete item |
| GET | /api/orders | any | staff sees all, table sees own |
| POST | /api/orders | any | place order |
| PUT | /api/orders/:id | staff | update status |
| DELETE | /api/orders/:id | staff | delete order |
