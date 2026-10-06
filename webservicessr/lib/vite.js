// webservicessr/lib/vite.js
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Helper para Handlebars que genera las etiquetas de Vite.
 * EN DESARROLLO: conecta al servidor de desarrollo de Vite.
 * EN PRODUCCION: usa los archivos compilados leyendo el manifest.
 */
export function viteAssets() {
  const isDev = process.env.NODE_ENV !== 'production';
  // En Codespaces, Vite se alcanza por una URL pública con el puerto 5173
const codespace = process.env.CODESPACE_NAME;
const dominio = process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN || 'app.github.dev';
const viteDevServer =
  process.env.VITE_DEV_SERVER ||
  (codespace ? `https://${codespace}-5173.${dominio}` : 'http://localhost:5173');
  if (isDev) {
    return `<script type="module" src="${viteDevServer}/@vite/client"></script>
<script type="module" src="${viteDevServer}/main.js"></script>`;
  }

  // PRODUCCIÓN: lee dist/.vite/manifest.json
  const manifestPath = path.join(__dirname, '..', 'dist', '.vite', 'manifest.json');

  if (!fs.existsSync(manifestPath)) {
    console.warn("Vite manifest not found. Run 'npm run build'");
    return '';
  }

  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
  const entry = manifest['main.js'];

  if (!entry) {
    console.warn("Entry 'main.js' not found in Vite manifest");
    return '';
  }

  const css = (entry.css || [])
    .map((file) => `<link rel="stylesheet" href="/${file}">`)
    .join('\n');

  return `${css}
<script type="module" src="/${entry.file}"></script>`;
}