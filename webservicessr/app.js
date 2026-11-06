import createError from 'http-errors';
import express from 'express';
import path from 'node:path';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import createDebug from 'debug';
import configureHandlebars from './lib/handlebars.js';
import { fileURLToPath } from 'node:url';

import indexRouter from '#routes/index.js';
import usersRouter from '#routes/users.js';

// __dirname no existe por defecto en ES modules, hay que recrearlo
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const debug = createDebug('webservicessr:server');

const app = express();
debug('✨ Creando backend');

configureHandlebars(app);

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// archivos estaticos compilados por vite (solo produccion)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
}

debug('📁 Creando servidor de Archivos Estáticos');
app.use(express.static(path.join(__dirname, 'public')));

debug('🔀 Registrando rutas');
app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use((req, res, next) => {
  next(createError(404));
});

app.use((err, req, res, _next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

// ejemplo de codigo inalcanzable
// (()=>{
//  let age=10
//
//  if (age< 10) {
//    console.log("age is less than 10")
//  }
//  return age
// })()

export default app;
