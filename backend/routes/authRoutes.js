const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// POST /api/auth/login, authenticate a user and return a JWT
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }
        const token = jwt.sign(
            { id: user._id, username: user.username, role: user.role, tableNumber: user.tableNumber },
            process.env.JWT_SECRET,
            { expiresIn: '12h' }
        );
        res.status(200).json({ token, username: user.username, role: user.role, tableNumber: user.tableNumber });
    } catch (err) {
        res.status(500).json({ error: 'Login failed' });
    }
});

module.exports = router;
