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
  // en Codespaces vite se alcanza por una url publica con el puerto 5173
  const codespace = process.env.CODESPACE_NAME;
  const dominio = process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN || 'app.github.dev';
  const viteDevServer =
    process.env.VITE_SERVER ||
    (codespace ? `https://${codespace}-5173.${dominio}` : 'http://localhost:5173');

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

  // leyendo y parseando el manifiesto que genera vite en la compilacion
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  // punto de entrada del front-end
  const mainEntry = manifest['main.js'];

  // guarda por si main.js no esta en el manifiesto
  if (!mainEntry) {
    console.warn('El archivo main.js no esta disponible en el manifiesto de vite');
    return '';
  }

  let tags = '';

  // archivos css
  if (mainEntry.css) {
    mainEntry.css.forEach((cssFile) => {
      tags += `<link rel="stylesheet" href="/${cssFile}">\n`;
    });
  }

  // archivo js
  tags += `<script type="module" src="/${mainEntry.file}" defer></script>`;

  return tags;
}

/**
 * Registra el helper viteAssets en handlebars
 */
export function registerViteHelper(hbs) {
  hbs.registerHelper('viteAssets', () => {
    // sanitizando la salida del helper
    return new hbs.SafeString(viteAssets());
  });
}
