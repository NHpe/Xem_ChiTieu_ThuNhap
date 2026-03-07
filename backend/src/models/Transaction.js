const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    user: { // Id của người dùng
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    type: { // Chi tiêu hay thu nhập
        type: String,
        enum: ['income', 'expense'],
        required: true,
    },
    name: { // Tên giao dịch
        type: String,
        required: true,
    },
    amount: { // Số tiền
        type: Number,
        required: true,
        min: 0,
        default: 0,
    },
    date: { // Ngày giao dịch
        type: Date,
        required: true,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Transaction', transactionSchema);