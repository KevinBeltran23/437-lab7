import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/labsApi": "http://localhost:3000", // forwards all requests at localhost:5173/labsApi/*
      "/labsApi/auth": "http://localhost:3000",
      "/labsApi/uploads": "http://localhost:3000"
    }
  }
})
