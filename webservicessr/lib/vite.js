// flujo de archivos
import fs from 'node:fs';
// libreria de rutas
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// creando variables de rutas
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Helper para handlebars que genera las etiquetas de vite
 * En desarrollo: conecta al servidor de desarrollo de vite
 * En produccion: usa los compilados de vite
 */
export function viteAssets() {
  // obtener modo de ejecucion
  const isDev = process.env.NODE_ENV !== 'production';
  // url del servidor de desarrollo de vite
  const viteDevServer = process.env.VITE_SERVER || 'http://localhost:5173';

  if (isDev) {
    // en desarrollo cargamos los archivos del front-end directo del servidor de vite
    return `<script type="module" src="${viteDevServer}/@vite/client"></script>
<script type="module" src="${viteDevServer}/main.js"></script>`;
  }

  // en produccion leemos el manifest que genera vite
  const manifestPath = path.join(__dirname, '..', 'dist', '.vite', 'manifest.json');

  // si no existe el manifiesto
  if (!fs.existsSync(manifestPath)) {
    console.warn('Vite manifest not found. Run npm run build');
    return '';
  }

  return '';
}
