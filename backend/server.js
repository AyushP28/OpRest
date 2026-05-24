require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');

// import our route files
const menuRoutes = require('./routes/menuRoutes');
const orderRoutes = require('./routes/orderRoutes');
const authRoutes = require('./routes/authRoutes');
const { seedDatabase } = require('./data/seed');

const app = express();
const server = http.createServer(app);
const PORT = 8080;

// attach socket.io to the http server
const io = new Server(server, {
    cors: { origin: 'http://localhost:5173', methods: ['GET', 'POST'] }
});

const dbURL = process.env.MONGODB_URI || 'mongodb://localhost:27017/openrest';

// lets our react frontend talk to this server
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// make io accessible inside route handlers
app.set('io', io);

// hook up the routes
app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);

// handle any routes that don't exist
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// catch any unexpected errors
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal server error' });
});

// socket.io connection handling
io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // let a client join a room for a specific order
    socket.on('join_order_room', (orderId) => {
        socket.join(orderId);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

// connect to mongodb first, then start the server
mongoose.connect(dbURL)
    .then(async () => {
        console.log('Connected to MongoDB');
        await seedDatabase();
        server.listen(PORT, () => {
            console.log(`OpenRest server started on http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('Could not connect to MongoDB:', err.message);
        process.exit(1);
    });
