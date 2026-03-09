// frontend/src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard'; 
import ProtectedRoute from './components/ProtectedRoute';


function App() {
    // key là token được lưu trong sessionStorage sau khi đăng nhập thành công
    const [key, setKey] = useState(sessionStorage.getItem('key') || null);

    // Xử lý đăng nhập
    const handleLogin = (newKey) => {
        setKey(newKey);
        sessionStorage.setItem('key', newKey);
    }

    // Xử lý đăng xuất
    const handleLogout = () => {
        setKey(null);
        sessionStorage.removeItem('key');
    }
    
    const isAuthenticated = Boolean(key); // Kiểm tra xem người dùng đã đăng nhập hay chưa

    return (
        <BrowserRouter>
            <Routes>
                {/* Nếu người dùng truy cập vào /, chuyển hướng đến dashboard nếu đã đăng nhập, ngược lại chuyển đến login */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />

                {/* Nếu người dùng truy cập vào /login, nếu đã đăng nhập thì chuyển hướng đến dashboard, ngược lại hiển thị trang đăng nhập */}
                <Route path="/login" element={
                    isAuthenticated ? (<Navigate to="/dashboard" replace />) : (
                        <Auth onLogin={handleLogin} />
                    )
                } />

                {/* Route bảo vệ cho dashboard, chỉ cho phép truy cập nếu đã đăng nhập */}
                <Route 
                    path="/dashboard" 
                    element={
                        <ProtectedRoute isAuthenticated={isAuthenticated}>
                            <Dashboard onLogout={handleLogout} />
                        </ProtectedRoute>
                    } 
                />

                {/* Chuyển hướng tất cả các đường dẫn không hợp lệ về /login */}
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;