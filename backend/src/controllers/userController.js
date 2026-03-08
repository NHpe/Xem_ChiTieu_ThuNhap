const User = require('../models/User');

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

            res.status(200).json({ message: 'Đăng nhập thành công' });
        } catch (error) {
            res.status(500).json({ message: 'Lỗi máy chủ : ' + error.message });
        }
    }
}

module.exports = new UserController();