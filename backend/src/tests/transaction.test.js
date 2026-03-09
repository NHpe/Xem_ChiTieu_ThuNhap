const request = require('supertest');
const express = require('express');
const transactionRoute = require('../routes/transactionRoute');
const Transaction = require('../models/Transaction');
const crypto = require('crypto');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const {connectDB, disconnectDB} = require('../config/db');
connectDB();

// Tạo một instance của ứng dụng Express
const app = express();
app.use(express.json());
app.use('/api/transactions', transactionRoute);

let token;
let testUserId;
// Tạo test user trước khi thực hiện test
beforeAll(async () => {
    const testUser = new User({ username: 'test_user_1', password: 'password123' });
    await testUser.save();
    testUserId = testUser._id;

    // Tạo token JWT cho test user
    token = jwt.sign({ userId: testUser._id }, process.env.JWT_SECRET || 'test_secret_key', { expiresIn: '1h' });
});

// Xóa test user sau khi test hoàn thành
afterAll(async () => {
    await Transaction.deleteMany({ user: testUserId });
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
            amount: '100000',
            date: new Date()
        };

        const response = await request(app)
            .post('/api/transactions')
            .set('Cookie', `token=${token}`)
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
            .get(`/api/transactions/${user._id}`)
            .set('Cookie', `token=${token}`);

        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });
});

// Thực hiện test xóa giao dịch
describe('DELETE /api/transactions/:id', () => {
    it('Xóa giao dịch thành công', async () => {
        const transaction = await Transaction.findOne({ name: 'Test Transaction' });
        const response = await request(app)
            .delete(`/api/transactions/${transaction._id}`)
            .set('Cookie', `token=${token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('message', 'Giao dịch đã được xóa');
    });
});

// Thực hiện test các chức năng nếu không có token hoặc token không hợp lệ
describe('Unauthorized access', () => {
    it('Tạo giao dịch mới mà không có token', async () => {
        const transactionData = {
            user: 'test_user_1',
            type: 'income',
            name: 'Unauthorized Transaction',
            amount: '50000',
            date: new Date()
        };
        const response = await request(app)
            .post('/api/transactions')
            .send(transactionData);
        expect(response.statusCode).toBe(401);
    });

    it('Lấy danh sách giao dịch mà không có token', async () => {
        const user = await User.findOne({ username: 'test_user_1' });
        const response = await request(app)
            .get(`/api/transactions/${user._id}`);
        expect(response.statusCode).toBe(401);
    });

    it('Xóa giao dịch mà không có token', async () => {
        const transaction = await Transaction.findOne({ name: 'Test Transaction' });
        const response = await request(app)
            .delete(`/api/transactions/${transaction._id}`);
        expect(response.statusCode).toBe(401);
    });
});