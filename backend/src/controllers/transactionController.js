const Transaction = require('../models/Transaction');
const authenticate = require('../middlewares/authMiddleware');

class TransactionController {
    // Tạo giao dịch mới
    async createTransaction(req, res) {
        const {user, type, name, amount, date} = req.body;
        try {
            const newTransaction = new Transaction({user, type, name, amount, date});
            await newTransaction.save();
            res.status(201).json({message: 'Giao dịch đã được tạo'});
        } catch (error) {
            res.status(500).json({message: 'Lỗi máy chủ : ' + error.message});
        }
    }

    // Lấy danh sách giao dịch của người dùng
    async getTransactions(req, res) {
        const userId = req.params.userId;
        try {
            const transactions = await Transaction.find({user: userId}).sort({date: -1});
            res.status(200).json(transactions);
        } catch (error) {
            res.status(500).json({message: 'Lỗi máy chủ : ' + error.message});
        }   
    }

    // Xóa giao dịch
    async deleteTransaction(req, res) {
        const transactionId = req.params.id;
        try {
            await Transaction.findByIdAndDelete(transactionId);
            res.status(200).json({message: 'Giao dịch đã được xóa'});
        } catch (error) {
            res.status(500).json({message: 'Lỗi máy chủ : ' + error.message});
        }
    }
}

module.exports = new TransactionController();s