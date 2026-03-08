const request = require('supertest');
const express = require('express');
const transactionRoute = require('../routes/transactionRoute');
const Transaction = require('../models/Transaction');
const crypto = require('crypto');
const User = require('../models/User');

const {connectDB, disconnectDB} = require('../config/db');
connectDB();

// Tạo một instance của ứng dụng Express
const app = express();
app.use(express.json());
app.use('/api/transactions', transactionRoute);

let token;
// Tạo test user trước khi thực hiện test
beforeAll(async () => {
    const testUser = new User({ username: 'test_user_1', password: 'password123' });
    await testUser.save();

    // Tạo token JWT cho test user
    const payload = { id: testUser._id, username: testUser.username };
    
});

// Xóa test user sau khi test hoàn thành
afterAll(async () => {
    await User.deleteOne({ username: 'test_user_1' });
    // Đóng kết nối đến cơ sở dữ liệu sau khi hoàn thành tất cả các test
    disconnectDB();
});

// Thực hiện test tạo giao dịch mới
describe('POST /api/transactions', () => {
    it('Tạo giao dịch mới thành công', async () => {
        const transactionData = {
            user: 'test_user_1',
            type: 'income',
            name: 'Test Transaction',
            amount: 1000,
            date: new Date()
        };

        const response = await request(app)
            .post('/api/transactions')
            .send(transactionData);

        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('message', 'Giao dịch đã được tạo');
    });
});

// Thực hiện test lấy danh sách giao dịch của người dùng
describe('GET /api/transactions/:userId', () => {
    it('Lấy danh sách giao dịch của người dùng thành công', async () => {
        const user = await User.findOne({ username: 'test_user_1' });
        const response = await request(app)
            .get(`/api/transactions/${user._id}`);

        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });
});

// Thực hiện test xóa giao dịch
describe('DELETE /api/transactions/:id', () => {
    it('Xóa giao dịch thành công', async () => {
        const transaction = await Transaction.findOne({ name: 'Test Transaction' });
        const response = await request(app)
            .delete(`/api/transactions/${transaction._id}`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('message', 'Giao dịch đã được xóa');
    });
});