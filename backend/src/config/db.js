// Kết nối MongoDB
const mongoose = require('mongoose');

const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };
const connectDB = () => {
    mongoose.connect(process.env.MONGO_URI, clientOptions)
    .then(() => console.log('Kết nối MongoDB thành công'))
    .catch((err) => console.error('Lỗi kết nối MongoDB:', err));
};

const disconnectDB = async() => {
    await mongoose.disconnect()
    .then(() => console.log('Đã ngắt kết nối MongoDB'))
    .catch((err) => console.error('Lỗi ngắt kết nối MongoDB:', err));
};

module.exports = { connectDB, disconnectDB };