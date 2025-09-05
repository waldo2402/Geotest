import path from 'path';
import { defineConfig, loadEnv } from 'vite';
<<<<<<< HEAD
=======
import react from '@vitejs/plugin-react';
>>>>>>> 43f92ad (Primer commit)

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
<<<<<<< HEAD
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
=======
        plugins: [react()],
        base: '/Geotest/', // <- Importante para GitHub Pages
        define: {
            'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
            'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
        },
        resolve: {
            alias: {
                '@': path.resolve(__dirname, '.'),
            }
        }
>>>>>>> 43f92ad (Primer commit)
    };
});
