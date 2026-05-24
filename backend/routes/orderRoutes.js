const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { requireAuth, requireStaff } = require('../middleware/auth');

// GET /api/orders, staff sees all orders, table sees only their own
router.get('/', requireAuth, async (req, res) => {
    try {
        let query = {};
        if (req.user.role === 'table') {
            query = { tableNumber: req.user.tableNumber };
        }
        const allOrders = await Order.find(query).sort({ createdAt: -1 });
        res.status(200).json(allOrders);
    } catch (err) {
        console.error('Error getting orders:', err);
        res.status(500).json({ error: 'Failed to get orders' });
    }
});

// GET /api/orders/:id, get one order by id
router.get('/:id', requireAuth, async (req, res) => {
    try {
        const foundOrder = await Order.findById(req.params.id);
        if (!foundOrder) {
            return res.status(404).json({ error: 'Order not found' });
        }
        // table users can only view their own orders
        if (req.user.role === 'table' && foundOrder.tableNumber !== req.user.tableNumber) {
            return res.status(403).json({ error: 'Access denied' });
        }
        res.status(200).json(foundOrder);
    } catch (err) {
        res.status(500).json({ error: 'Failed to get order' });
    }
});

// POST /api/orders, submit a new order
router.post('/', requireAuth, async (req, res) => {
    try {
        const orderData = {
            ...req.body,
            tableNumber: req.user.tableNumber || req.body.tableNumber,
            customerName: req.body.customerName || req.user.username
        };
        const newOrder = new Order(orderData);
        const savedOrder = await newOrder.save();
        console.log('New order received:', savedOrder.customerName, 'table', savedOrder.tableNumber);

        // emit socket event so kitchen dashboard updates in real time
        const io = req.app.get('io');
        io.emit('new_order', savedOrder);

        res.status(201).json(savedOrder);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// PUT /api/orders/:id, update the status of an order (staff only)
router.put('/:id', requireStaff, async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true, runValidators: true }
        );
        if (!updatedOrder) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // emit socket event so the table's order page updates in real time
        const io = req.app.get('io');
        io.emit('order_updated', { orderId: updatedOrder._id.toString(), status: updatedOrder.status });

        res.status(200).json(updatedOrder);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE /api/orders/:id, cancel/remove an order (staff only)
router.delete('/:id', requireStaff, async (req, res) => {
    try {
        const deletedOrder = await Order.findByIdAndDelete(req.params.id);
        if (!deletedOrder) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.status(200).json({ message: 'Order cancelled', id: req.params.id });
    } catch (err) {
        res.status(500).json({ error: 'Failed to cancel order' });
    }
});

module.exports = router;
