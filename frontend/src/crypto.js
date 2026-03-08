import CryptoJS from 'crypto-js';

// Hàm mã hóa mật khẩu
function hashPassword(password) {
    return CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);
}

// Hàm tạo khóa AES
function createAESKey(username, password) {
    const salt = CryptoJS.enc.Utf8.parse(username); 
    const key = CryptoJS.PBKDF2(password, salt, {
        keySize: 256 / 32,
        iterations: 1000
    });
    return key.toString(CryptoJS.enc.Hex);
}

export { hashPassword, createAESKey };