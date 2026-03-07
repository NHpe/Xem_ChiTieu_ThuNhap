// Khai báo dotenv
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Khai báo các thư viện cần thiết
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');

// Kết nối đến cơ sở dữ liệu MongoDB
connectDB();

// Khởi tạo Express app
const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Định nghĩa các route
app.get('/', (req, res) => {
    res.send('API đang hoạt động');
});

app.listen(process.env.PORT, () => {
    console.log(`Server đang chạy trên cổng ${process.env.PORT}`);
});