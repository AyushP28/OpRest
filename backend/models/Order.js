const mongoose = require('mongoose');

// structure for each item inside an order 
const orderItemSchema = new mongoose.Schema({
    foodname: { type: String, required: true },
    price:    { type: Number, required: true },
    qty:      { type: Number, required: true, min: 1 }
}, { _id: false });

// main order structure
const orderSchema = new mongoose.Schema({
    customerName: {
        type: String,
        required: [true, 'Customer name is required'],
        trim: true
    },
    tableNumber: {
        type: Number,
        required: [true, 'Table number is required'],
        min: 1
    },
    items: {
        type: [orderItemSchema],
        validate: {
            validator: function(v) { return v.length > 0 },
            message: 'Order must have at least one item'
        }
    },
    total: {
        type: Number,
        required: true,
        min: 0
    },
    // track where the order currently is
    status: {
        type: String,
        enum: ['pending', 'preparing', 'ready', 'delivered'],
        default: 'pending'
    }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
