import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    // Bind to 0.0.0.0 so the server is reachable on both
    // IPv4 (127.0.0.1) and IPv6 (::1) — fixes blank page in VS Code / preview browsers
    host: '0.0.0.0',
    port: 5175,
    strictPort: false,
  },
})
