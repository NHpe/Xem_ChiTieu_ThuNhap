// Kết nối MongoDB
const mongoose = require('mongoose');

const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };
const connectDB = () => {
    mongoose.connect(process.env.MONGO_URI, clientOptions)
    .then(() => console.log('Kết nối MongoDB thành công'))
    .catch((err) => console.error('Lỗi kết nối MongoDB:', err));
};

const disconnectDB = async() => {
    await mongoose.disconnect();
    console.log('Đóng kết nối MongoDB thành công');
};

module.exports = { connectDB, disconnectDB };