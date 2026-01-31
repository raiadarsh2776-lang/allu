import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    // process.cwd() ensures paths are correct in the Vercel cloud environment
    const env = loadEnv(mode, process.cwd(), ''); 
    
    return {
      plugins: [react()],
      define: {
        // Essential for production build to see your API keys
        'process.env.VITE_API_KEY': JSON.stringify(env.VITE_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.VITE_API_KEY),
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});