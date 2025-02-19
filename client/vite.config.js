/client/vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Cho phép truy cập từ tất cả địa chỉ IP
    port: 5173, // Port mặc định
    strictPort: true, // Nếu port bị chiếm, báo lỗi thay vì tự động tìm port khác
    watch: {
      usePolling: true // Cải thiện độ ổn định khi watch files
    }
  }
})