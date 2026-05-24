const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['staff', 'table'],
        required: true
    },
    // only populated for table accounts
    tableNumber: {
        type: Number,
        default: null
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
