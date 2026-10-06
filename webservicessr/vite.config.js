import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  // Carpeta donde viven los archivos del front-end
  root: 'src',

  // Servidor de desarrollo
    server: {
    port: 5173,
    strictPort: true,
    host: true,
    // Permite peticiones desde los dominios de Codespaces
    allowedHosts: true,
    cors: true,
  },

  // Configuración del build (producción)
  build: {
    // Carpeta de salida: webservicessr/dist
    outDir: '../dist',
    emptyOutDir: true,
    // Genera el manifest.json que lee nuestro helper
    manifest: true,
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL('./src/main.js', import.meta.url)),
      },
    },
  },

  publicDir: false,
});