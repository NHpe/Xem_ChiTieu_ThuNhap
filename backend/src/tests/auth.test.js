const request = require('supertest');
const express = require('express');
const userRoute = require('../routes/userRoute');
const User = require('../models/User');

const {connectDB, disconnectDB} = require('../config/db');
connectDB();

// Tạo một instance của ứng dụng Express
const app = express();
app.use(express.json());
app.use('/api/users', userRoute);

// Xóa test user sau khi test hoàn thành
afterAll(async () => {
    await User.deleteOne({ username: 'test_user_1' });
    // Đóng kết nối đến cơ sở dữ liệu sau khi hoàn thành tất cả các test
    disconnectDB();
});

// Thực hiện test đăng ký người dùng
describe('POST /api/users/register', () => {
    it('Đăng ký người dùng thành công', async () => {
        const userData = {
            username: 'test_user_1',
            password: 'password123'
        };

        const response = await request(app)
            .post('/api/users/register')
            .send(userData);

        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('message', 'Đăng ký thành công');
    });

    it('Đăng ký người dùng thất bại khi username đã tồn tại', async () => {
        const userData = {
            username: 'test_user_1',
            password: 'password123'
        };

        const response = await request(app)
            .post('/api/users/register')
            .send(userData);

        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('message', 'Tên đăng nhập đã tồn tại');
    });
});

// Thực hiện test đăng nhập người dùng
describe('POST /api/users/login', () => {
    it('Đăng nhập người dùng thành công', async () => {
        const userData = {
            username: 'test_user_1',
            password: 'password123'
        };

        const response = await request(app)
            .post('/api/users/login')
            .send(userData);

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('message', 'Đăng nhập thành công');
    });

    it('Đăng nhập người dùng thất bại khi không tồn tại tên đăng nhập', async () => {
        const userData = {
            username: 'non_existent_user',
            password: 'password123'
        };

        const response = await request(app)
            .post('/api/users/login')
            .send(userData);

        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('message', 'Tên đăng nhập hoặc mật khẩu không đúng');
    });

    it('Đăng nhập người dùng thất bại khi mật khẩu sai', async () => {
        const userData = {
            username: 'test_user_1',
            password: 'wrong_password'
        };

        const response = await request(app)
            .post('/api/users/login')
            .send(userData);

        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('message', 'Tên đăng nhập hoặc mật khẩu không đúng');
    });
});