const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuItem');
const { requireStaff } = require('../middleware/auth');

// GET /api/menu, get all menu items (public, customers can see the menu)
router.get('/', async (req, res) => {
    try {
        const menuItems = await MenuItem.find().sort({ category: 1 });
        res.status(200).json(menuItems);
    } catch (err) {
        console.error('Error getting menu items:', err);
        res.status(500).json({ error: 'Failed to get menu items' });
    }
});

// GET /api/menu/:id, get one menu item by id (public)
router.get('/:id', async (req, res) => {
    try {
        const foundItem = await MenuItem.findById(req.params.id);
        if (!foundItem) {
            return res.status(404).json({ error: 'Item not found' });
        }
        res.status(200).json(foundItem);
    } catch (err) {
        res.status(500).json({ error: 'Failed to get menu item' });
    }
});

// POST /api/menu, add a new menu item (staff only)
router.post('/', requireStaff, async (req, res) => {
    try {
        const newItem = new MenuItem(req.body);
        const savedItem = await newItem.save();
        res.status(201).json(savedItem);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// PUT /api/menu/:id, update an existing menu item (staff only)
router.put('/:id', requireStaff, async (req, res) => {
    try {
        const updatedItem = await MenuItem.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedItem) {
            return res.status(404).json({ error: 'Item not found' });
        }
        res.status(200).json(updatedItem);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE /api/menu/:id, remove a menu item (staff only)
router.delete('/:id', requireStaff, async (req, res) => {
    try {
        const deletedItem = await MenuItem.findByIdAndDelete(req.params.id);
        if (!deletedItem) {
            return res.status(404).json({ error: 'Item not found' });
        }
        res.status(200).json({ message: 'Item deleted', id: req.params.id });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete item' });
    }
});

module.exports = router;
