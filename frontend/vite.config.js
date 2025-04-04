import { defineConfig } from 'vite';
// import fs from 'fs';
import react from '@vitejs/plugin-react';
import eslint from 'vite-plugin-eslint';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    eslint({
      lintOnStart: true,
      failOnError: mode === "production"
    })
  ],
  // To automatically open the app in the browser whenever the server starts,
  // uncomment the following lines:
  server: {
    proxy:{
      "/api": "http://localhost:8000"
    },
    host: process.env.HOST || '0.0.0.0',
    port: process.env.PORT || 3001,
    https: false,
    // https:{
    //   key: fs.readFileSync('./ssl/key.pem'),
    //   cert: fs.readFileSync('./ssl/cert.pem'),
    // }
  }
}));
