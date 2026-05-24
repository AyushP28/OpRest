const mongoose = require('mongoose');

// structure for a single menu item
const menuItemSchema = new mongoose.Schema({
    foodname: {
        type: String,
        required: [true, 'Food name is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true
    },
    category: {
        type: String,
        required: true,
        enum: ['appetizer', 'main', 'side', 'dessert', 'beverage'] // only these are allowed
    },
    price: {
        type: Number,
        required: true,
        min: [0, 'Price cant be negative']
    },
    // dietary info
    vegan:   { type: Boolean, default: false },
    chicken: { type: Boolean, default: false },
    beef:    { type: Boolean, default: false },
    pork:    { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('MenuItem', menuItemSchema);
