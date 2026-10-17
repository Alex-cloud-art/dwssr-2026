import { defineConfig } from 'vite';
// importando rutas
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
// importando tailwind
import tailwindcss from '@tailwindcss/vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  // carpeta donde viven los archivos del front-end
  root: 'src',
  // agregando a vite el plugin de tailwind
  plugins: [tailwindcss()],
  server: {
    // puerto de escucha del servidor de desarrollo
    port: 5173,
    // si el puerto esta ocupado no cambia a otro
    strictPort: true,
    // permite conexiones externas en el entorno de red
    host: true,
    // permite peticiones desde los dominios de Codespaces
    allowedHosts: true,
    // habilita CORS para permitir solicitudes desde Express
    cors: true,
  },
  // configurando build
  build: {
    // directorio de salida para produccion
    outDir: '../dist',
    // asegurando limpieza del folder de produccion
    emptyOutDir: true,
    // manifiesto para el servidor
    manifest: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/main.js'),
      },
    },
  },
});
