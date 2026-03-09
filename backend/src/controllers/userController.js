const User = require('../models/User');
const jwt = require('jsonwebtoken');

class UserController {
    // Đăng ký người dùng mới
    async register(req, res) {
        const { username, password } = req.body;
        try {
            // Kiểm tra nếu username đã tồn tại
            const existingUser = await User.findOne({ username });
            if (existingUser) {
                return res.status(400).json({ message: 'Tên đăng nhập đã tồn tại' });
            }

            // Tạo người dùng mới
            const newUser = new User({ username, password });
            await newUser.save();

            res.status(201).json({ message: 'Đăng ký thành công' });
        } catch (error) {
            res.status(500).json({ message: 'Lỗi máy chủ : ' + error.message });
        }
    }

    // Đăng nhập người dùng
    async login(req, res) {
        const { username, password } = req.body;
        try {
            // Tìm người dùng theo username
            const user = await User.findOne({ username });
            if (!user) {
                return res.status(400).json({ message: 'Tên đăng nhập hoặc mật khẩu không đúng' });
            }

            // So sánh mật khẩu
            if (user.password !== password) {
                return res.status(400).json({ message: 'Tên đăng nhập hoặc mật khẩu không đúng' });
            }

            // Sinh token JWT
            const token = jwt.sign(
                { userId: user._id }, 
                process.env.JWT_SECRET || 'test_secret_key', 
                { expiresIn: '1h' }
            );  
            res.cookie('token', token, {
                httpOnly: true, 
                secure: process.env.NODE_ENV === 'production' ,
                sameSite: 'strict',
                maxAge: 3600000 // 1 giờ
            });

            

            res.status(200).json({ message: 'Đăng nhập thành công' });
        } catch (error) {
            res.status(500).json({ message: 'Lỗi máy chủ : ' + error.message });
        }
    }

    async logout(req, res) {
        res.clearCookie('token', {
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production' ,
            sameSite: 'strict',
        });
        res.status(200).json({ message: 'Đăng xuất thành công' });
    }
}

module.exports = new UserController();