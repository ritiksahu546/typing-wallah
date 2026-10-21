import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [
      {
        name: 'serve-seo-static-files',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            const urlPath = req.url?.split('?')[0];
            if (urlPath === '/sitemap.xml') {
              const filePath = path.resolve(__dirname, 'public/sitemap.xml');
              if (fs.existsSync(filePath)) {
                res.setHeader('Content-Type', 'application/xml; charset=utf-8');
                res.end(fs.readFileSync(filePath, 'utf-8'));
                return;
              }
            }
            if (urlPath === '/robots.txt') {
              const filePath = path.resolve(__dirname, 'public/robots.txt');
              if (fs.existsSync(filePath)) {
                res.setHeader('Content-Type', 'text/plain; charset=utf-8');
                res.end(fs.readFileSync(filePath, 'utf-8'));
                return;
              }
            }
            next();
          });
        },
      },
      react(),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
