// Khai báo dotenv
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Khai báo các thư viện cần thiết
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');

// Kết nối đến cơ sở dữ liệu MongoDB
connectDB();

// Khởi tạo Express app
const app = express();
app.use(cors(
    {
        credentials: true
    }
));
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json());

// Định nghĩa các route
const userRoute = require('./routes/userRoute');
const transactionRoute = require('./routes/transactionRoute');

app.use('/api/users', userRoute);
app.use('/api/transactions', transactionRoute);
app.get('/', (req, res) => {
    res.send('API đang hoạt động');
});

app.listen(process.env.PORT, () => {
    console.log(`Server đang chạy trên cổng ${process.env.PORT}`);
});