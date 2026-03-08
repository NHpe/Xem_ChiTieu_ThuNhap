import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom', // Bật trình duyệt ảo
    globals: true,        // Dùng các hàm describe, it, expect mà không cần import
    setupFiles: './src/setupTests.js', // File chạy trước khi test
  }
})
