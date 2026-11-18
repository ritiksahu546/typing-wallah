import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import {defineConfig} from 'vite';
import {
  verifyLeaderboardSubmissionPayload,
  checkSubmissionRateLimit,
} from './src/services/resultVerification';

export default defineConfig(() => {
  return {
    plugins: [
      {
        name: 'serve-seo-and-verification-api',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            const urlPath = req.url?.split('?')[0];
            if (urlPath === '/api/results/verify' && req.method === 'POST') {
              let body = '';
              req.on('data', (chunk) => {
                body += chunk.toString();
                if (body.length > 65536) {
                  req.destroy();
                }
              });
              req.on('end', () => {
                try {
                  const parsed = JSON.parse(body || '{}');
                  const { uid, result } = parsed;
                  const verification = verifyLeaderboardSubmissionPayload(result, uid);
                  if (!verification.valid) {
                    res.statusCode = 400;
                    res.setHeader('Content-Type', 'application/json; charset=utf-8');
                    res.end(JSON.stringify(verification));
                    return;
                  }
                  const rateCheck = checkSubmissionRateLimit(String(uid), String(result.id));
                  if (!rateCheck.allowed) {
                    res.statusCode = 429;
                    res.setHeader('Content-Type', 'application/json; charset=utf-8');
                    res.end(
                      JSON.stringify({
                        valid: false,
                        leaderboardEligible: false,
                        reason: rateCheck.reason,
                        retryAfterMs: rateCheck.retryAfterMs,
                      })
                    );
                    return;
                  }
                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'application/json; charset=utf-8');
                  res.end(JSON.stringify(verification));
                } catch {
                  res.statusCode = 400;
                  res.setHeader('Content-Type', 'application/json; charset=utf-8');
                  res.end(
                    JSON.stringify({
                      valid: false,
                      leaderboardEligible: false,
                      reason: 'Malformed JSON request body',
                    })
                  );
                }
              });
              return;
            }
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
