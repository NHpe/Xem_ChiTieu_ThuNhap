import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { hashPassword } from '../crypto';
import axios from 'axios';
import './Auth.css';

function Auth() {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState({ text: '', type: '' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Xử lý dữ liệu nhập vào
        if (!username || !password || (!isLogin && !confirmPassword)) {
            setMessage({ text: 'Vui lòng điền đầy đủ thông tin', type: 'error' });
            return;
        }
        
        // Xử lý đăng ký
        if (!isLogin) {
            try {
                if (password !== confirmPassword) {
                    setMessage({ text: 'Mật khẩu và xác nhận mật khẩu không khớp', type: 'error' });
                    return;
                }

                const hashedPassword = hashPassword(password);
                const response = await axios.post('/api/users/register', 
                  { username, password: hashedPassword },
                  { withCredentials: true }
                );
                
                if (response.status === 201) {
                    setMessage({ text: 'Đăng ký thành công. Vui lòng đăng nhập lại', type: 'success' });
                    setIsLogin(true);
                } else {
                    setMessage({ text: `${response.data.message}`, type: 'error' });
                }
            } catch (error) {
                setMessage({ text: `Đã xảy ra lỗi khi đăng ký: ${error.message}`, type: 'error' });
            }
        // Xử lý đăng nhập
        } else {
            try {
                const hashedPassword = hashPassword(password);
                const response = await axios.post('/api/users/login', 
                  { username, password: hashedPassword },
                  { withCredentials: true }
                );

                if (response.status === 200) {
                    setMessage({ text: 'Đăng nhập thành công', type: 'success' });
                    navigate('/dashboard');
                } else {
                    setMessage({ text: 'Tên đăng nhập hoặc mật khẩu không đúng', type: 'error' });
                }
            } catch (error) {
                setMessage({ text: `Xảy ra lỗi khi đăng nhập: ${error.message}`, type: 'error' });
            }
        }
    };

    return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-wrapper">
          <h1 className="app-title">Quản Lý Chi Tiêu</h1>
          <h2 className="auth-title">
            {isLogin ? 'Đăng Nhập' : 'Tạo Tài Khoản'}
          </h2>
          
          <form className="auth-form" onSubmit={handleSubmit}>
            <input
              type="text"
              className="auth-input"
              placeholder="Tên đăng nhập"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="password"
              className="auth-input"
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {!isLogin && (
              <input
                type="password"
                className="auth-input"
                placeholder="Nhập lại mật khẩu"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            )}
            <button type="submit" className="auth-button">
              {isLogin ? 'Đăng nhập' : 'Đăng ký'}
            </button>
          </form>

          {message.text && (
            <div className={`auth-message ${message.type}`}>
              {message.text}
            </div>
          )}

          <div className="auth-switch">
            {isLogin ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'}
            <span onClick={() => {
              setIsLogin(!isLogin);
              setMessage({ text: '', type: '' }); 
            }}>
              {isLogin ? 'Đăng ký tài khoản' : 'Đăng nhập'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

}

export default Auth;