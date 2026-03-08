const TransactionController = require('../controllers/transactionController');
const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authMiddleware');

// Định nghĩa các route cho giao dịch
router.post('/', authenticate, TransactionController.createTransaction);
router.get('/:userId', authenticate, TransactionController.getTransactions);
router.delete('/:id', authenticate, TransactionController.deleteTransaction);

module.exports = router;