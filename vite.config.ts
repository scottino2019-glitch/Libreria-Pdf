import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import { defineConfig, Plugin } from 'vite';

function pdfFolderPlugin(): Plugin {
  const syncPdfIndex = () => {
    const publicPdfDir = path.resolve(__dirname, 'public', 'pdf');
    if (!fs.existsSync(publicPdfDir)) {
      fs.mkdirSync(publicPdfDir, { recursive: true });
    }
    const files = fs.readdirSync(publicPdfDir).filter(f => f.toLowerCase().endsWith('.pdf'));
    const pdfs = files.map(filename => {
      const filePath = path.join(publicPdfDir, filename);
      const stats = fs.statSync(filePath);
      const cleanTitle = filename.replace(/\.pdf$/i, '').replace(/_/g, ' ');
      return {
        id: filename,
        filename: filename,
        title: cleanTitle,
        size: stats.size,
        addedAt: stats.mtime.toISOString(),
        url: `/pdf/${encodeURIComponent(filename)}`,
        isSample: false,
      };
    });

    const indexPath = path.join(publicPdfDir, 'index.json');
    fs.writeFileSync(indexPath, JSON.stringify(pdfs, null, 2), 'utf-8');
    return pdfs;
  };

  return {
    name: 'pdf-folder-plugin',
    buildStart() {
      syncPdfIndex();
    },
    configureServer(server) {
      syncPdfIndex();
      server.middlewares.use((req, res, next) => {
        if (!req.url) return next();
        const decodedUrl = decodeURIComponent(req.url.split('?')[0]);
        if (decodedUrl === '/pdf/index.json' || decodedUrl === '/pdf/list.json') {
          try {
            const pdfs = syncPdfIndex();
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(pdfs));
            return;
          } catch (err: any) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: err.message }));
            return;
          }
        }
        next();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), pdfFolderPlugin()],
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
