import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { create as createHbsEngine } from 'express-handlebars';

import { registerViteHelper } from './vite.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Exporta la función que configura Handlebars en la app de express
export default function configureHandlebars(app) {
  // Motor con extensión .hbs y layout principal "main"
  const exphbs = createHbsEngine({
    extname: '.hbs',
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, '..', 'views', 'layouts'),
  });

  // Registrando el helper de vite
  registerViteHelper(exphbs.handlebars);

  // Registrando el motor en express
  app.engine('hbs', exphbs.engine);
  app.set('view engine', 'hbs');
  app.set('views', path.join(__dirname, '..', 'views'));
}
