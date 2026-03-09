import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeAll, afterAll, afterEach, describe, it, expect, vi } from 'vitest';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import Auth from '../pages/Auth';

// Mock useNavigate để kiểm tra điều hướng sau khi đăng nhập thành công
const mockedNavigate = vi.fn(); 

vi.mock('react-router-dom', async () => {
  // Lấy tất cả các tính năng thật (actual) của thư viện để không làm hỏng các hook khác
  const actual = await vi.importActual('react-router-dom'); 
  return {
    ...actual,
    useNavigate: () => mockedNavigate,
  };
});

// Thiết lập MSW
const server = setupServer(
  // Bắt API Đăng ký
  http.post('http://localhost:5000/api/auth/register', async ({ request }) => {
    return HttpResponse.json(
      { message: 'Đăng ký thành công! Vui lòng đăng nhập.' },
      { status: 201 }
    );
  }),

  // Bắt API Đăng nhập
  http.post('http://localhost:5000/api/auth/login', async ({ request }) => {
    return HttpResponse.json(
      { token: 'chuoi_token_xac_thuc_tu_msw', message: 'Đăng nhập thành công' },
      { status: 200 }
    );
  })
);

// Bật server trước khi test, dọn dẹp sau mỗi test case, và tắt đi khi test xong
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());


// Thực hiện test
describe('Test chức năng đăng ký', () => {
    it('Đăng ký thành công', async () => {
        // Render
        render(<Auth />);

        // Chọn tab Đăng ký
        const registerTab = screen.getByText(/Đăng ký tài khoản/i);
        userEvent.click(registerTab);   

        // Điền thông tin đăng ký
        const usernameInput = screen.getByPlaceholderText(/Tên đăng nhập/i);
        const passwordInput = screen.getAllByPlaceholderText(/Mật khẩu/i);
        const confirmPasswordInput = screen.getAllByPlaceholderText(/Nhập lại mật khẩu/i);
        const registerButton = screen.getByRole('button', { name: /Đăng ký/i });

        userEvent.type(usernameInput, 'testuser');
        userEvent.type(passwordInput, 'password123');
        userEvent.type(confirmPasswordInput, 'password123');
        userEvent.click(registerButton);

        // Chờ đợi thông báo thành công
        await waitFor(() => {
            const successMessage = screen.getByText(/Đăng ký thành công. Vui lòng đăng nhập lại/i);
            expect(successMessage).toBeInTheDocument();
        });
    });

    it('Dăng ký thất bại do thiếu thông tin', async () => {
        render(<Auth />);
        // Chọn tab Đăng ký
        const registerTab = screen.getByText(/Đăng ký tài khoản/i);
        userEvent.click(registerTab); 

        const registerButton = screen.getByRole('button', { name: /Đăng ký/i });
        userEvent.click(registerButton);
        await waitFor(() => {
            const errorMessage = screen.getByText(/Vui lòng điền đầy đủ thông tin/i);
            expect(errorMessage).toBeInTheDocument();
        });
    });

    it('Đăng ký thất bại do mật khẩu không khớp', async () => {
        render(<Auth />);
        // Chọn tab Đăng ký
        const registerTab = screen.getByText(/Đăng ký tài khoản/i);
        userEvent.click(registerTab); 

        const usernameInput = screen.getByPlaceholderText(/Tên đăng nhập/i);
        const passwordInput = screen.getByPlaceholderText(/Mật khẩu/i);
        const confirmPasswordInput = screen.getByPlaceholderText(/Nhập lại mật khẩu/i);
        const registerButton = screen.getByRole('button', { name: /Đăng ký/i });

        userEvent.type(usernameInput, 'testuser');
        userEvent.type(passwordInput, 'password123');
        userEvent.type(confirmPasswordInput, 'password456');
        userEvent.click(registerButton);

        await waitFor(() => {
            const errorMessage = screen.getByText(/Mật khẩu và xác nhận mật khẩu không khớp/i);
            expect(errorMessage).toBeInTheDocument();
        });
    });

    it('Đăng ký thất bại do tên đăng nhập đã tồn tại', async () => {
        // Mock API trả về lỗi khi tên đăng nhập đã tồn tại
        server.use(
            http.post('http://localhost:5000/api/auth/register', async ({ request }) => {
                return HttpResponse.json(
                    { message: 'Tên đăng nhập đã tồn tại' },
                    { status: 400 }
                );
            })
        );
        render(<Auth />);
        // Chọn tab Đăng ký
        const registerTab = screen.getByText(/Đăng ký tài khoản/i);
        userEvent.click(registerTab); 

        const usernameInput = screen.getByLabelText(/Tên đăng nhập/i);
        const passwordInput = screen.getByLabelText(/Mật khẩu/i);
        const confirmPasswordInput = screen.getByLabelText(/Nhập lại mật khẩu/i);
        const registerButton = screen.getByRole('button', { name: /Đăng ký/i });

        userEvent.type(usernameInput, 'existinguser');
        userEvent.type(passwordInput, 'password123');
        userEvent.type(confirmPasswordInput, 'password123');
        userEvent.click(registerButton);

        await waitFor(() => {
            const errorMessage = screen.getByText(/Tên đăng nhập đã tồn tại/i);
            expect(errorMessage).toBeInTheDocument();
        });
    });
});

describe('Test chức năng đăng nhập', () => {
    it('Đăng nhập thành công', async () => {
        render(<Auth />);

        const usernameInput = screen.getByPlaceholderText(/Tên đăng nhập/i);
        const passwordInput = screen.getByPlaceholderText(/Mật khẩu/i);
        const loginButton = screen.getByRole('button', { name: /Đăng nhập/i });

        userEvent.type(usernameInput, 'testuser');
        userEvent.type(passwordInput, 'password123');
        userEvent.click(loginButton);

        await waitFor(() => {
            const successMessage = screen.getByText(/Đăng nhập thành công/i);
            expect(successMessage).toBeInTheDocument();
            expect(mockedNavigate).toHaveBeenCalledWith('/dashboard');
        });
    });

    it('Đăng nhập thất bại do thiếu thông tin', async () => {
        render(<Auth />);
        const loginButton = screen.getByRole('button', { name: /Đăng nhập/i });
        userEvent.click(loginButton);

        await waitFor(() => {
            const errorMessage = screen.getByText(/Vui lòng điền đầy đủ thông tin/i);
            expect(errorMessage).toBeInTheDocument();
            expect(mockedNavigate).not.toHaveBeenCalled();
        });
    });

    it('Đăng nhập thất bại do sai thông tin', async () => {
        // Mock API trả về lỗi khi đăng nhập sai
        server.use(
            http.post('http://localhost:5000/api/auth/login', async ({ request }) => {
                return HttpResponse.json(
                    { message: 'Tên đăng nhập hoặc mật khẩu không đúng' },
                    { status: 400 }
                );
            })
        );

        render(<Auth />);

        const usernameInput = screen.getAllByPlaceholderText(/Tên đăng nhập/i);
        const passwordInput = screen.getByPlaceholderText(/Mật khẩu/i);
        const loginButton = screen.getByRole('button', { name: /Đăng nhập/i });

        userEvent.type(usernameInput, 'wronguser');
        userEvent.type(passwordInput, 'wrongpassword');
        userEvent.click(loginButton);   

        await waitFor(() => {
            const errorMessage = screen.getByText(/Tên đăng nhập hoặc mật khẩu không đúng/i);
            expect(errorMessage).toBeInTheDocument();
            expect(mockedNavigate).not.toHaveBeenCalled();
        });
    });
});