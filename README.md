# OpenRest


## Overview
OpenRest is a restaurant ordering app. Customers need to scan a qr code at table that directs them to the ordering app. Customers need to login and can order food from their phone. Staff have access to manage customer orders and can also modify menu items.



---


## Documentation


### requirements


- Node.js
- MongoDB running on port 27017 (or use Atlas and change MONGODB_URI in backend/.env)


---


### how to run


open two terminals.


**terminal 1 - backend:**
```
cd backend
npm install
npm run dev
```
runs on http://localhost:8080


on first run it populates the DB with 15 menu items and 7 user accounts automatically


**terminal 2 - frontend:**
```
cd frontend
npm install
npm run dev
```
runs on http://localhost:5173


---


### accounts


these get populated automatically on first run:


| Username | Password | Role |
|----------|----------|------|
| staff1 | password123 | staff |
| staff2 | password123 | staff |
| table1 | table1pass | table |
| table2 | table2pass | table |
| table3 | table3pass | table |
| table4 | table4pass | table |
| table5 | table5pass | table |


---


### API routes


| Method | Route | Auth required | What it does |
|--------|-------|---------------|--------------|
| POST | /api/auth/login | none | log in, returns JWT |
| GET | /api/menu | none | get all menu items |
| GET | /api/menu/:id | none | get one item |
| POST | /api/menu | staff | add item |
| PUT | /api/menu/:id | staff | edit item |
| DELETE | /api/menu/:id | staff | delete item |
| GET | /api/orders | any logged in user | get orders (staff sees all, table sees own) |
| GET | /api/orders/:id | any logged in user | get one order |
| POST | /api/orders | any logged in user | place an order |
| PUT | /api/orders/:id | staff | update order status |
| DELETE | /api/orders/:id | staff | delete order |


---


### pages


**Login page** - everyone goes here first. Staff get sent to the kitchen dashboard after login, table accounts get sent to the order page. Both staff and customer login via same login page however functionality differs. After authentication, staff will have access to kitchen dashboard as well as the ability to modify menu items on the menu page. 


**Menu page** - staff uses this to manage items. Can filter by category, add new items, edit, or delete existing ones.


**Order page** - customers logged in via table accounts use this to place orders for specific table. They can add items to cart with '+' or '-', enter name and table number,and finally hit submit to place order. Also order history tab provided that shows history of customer orders.


**Kitchen page** - only staff accounts can access the kitchen page. It has a live dashboard showing customer orders in real time. Once customer places order it automatically shows order on kitchen dashboard without the need to refresh. Staff can update status of orders with pending, ready, delivered and customers can see status update in real time. 




---













______________________________________________________________________








# OpRest
