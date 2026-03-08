// frontend/src/App.jsx
import React, { useState } from 'react';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard'; 

function App() {
  // State quản lý xem người dùng đã đăng nhập chưa
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <div>
      {/* Nếu chưa đăng nhập thì hiện Auth, nếu rồi thì hiện Dashboard */}
      {!isAuthenticated ? (
        <Auth onLoginSuccess={() => setIsAuthenticated(true)} />
      ) : (
        <Dashboard/>
      )}
    </div>
  );
}

export default App;