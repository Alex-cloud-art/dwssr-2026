import { defineConfig } from 'eslint/config';
import js from '@eslint/js';
import globals from 'globals';
import { configs, plugins } from 'eslint-config-airbnb-extended';

export default defineConfig([
  // 1) Ignora los build de front y dependencias
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
  // 2) Reglas recomendadas de ESLint
  {
    name: 'js/config',
    ...js.configs.recommended,
  },
  // 3) Guia de estilos de Airbnb
  plugins.stylistic,
  plugins.importX,
  ...configs.base.recommended,
  plugins.node,
  ...configs.node.recommended,
  // 4) Globals del back-end
  {
    name: 'proyecto/back-end',
    files: [
      'app.js',
      'bin/**/*.js',
      'routes/**/*.js',
      'lib/**/*.js',
      'vite.config.js',
      'eslint.config.js',
    ],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
      globals: { ...globals.node },
    },
  },
  // 5) Globals del front-end
  {
    name: 'proyecto/front-end',
    files: ['src/**/*.{js,mjs}', 'public/**/*.{js,mjs}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
      globals: { ...globals.browser },
    },
  },
  // 6) Ajustes del proyecto sobre Airbnb
  {
    name: 'proyecto/reglas',
    rules: {
      // Node con ES modules exige la extension .js en los imports
      'import-x/extensions': 'off',
      // los alias #routes y #lib no los resuelve este plugin
      'import-x/no-unresolved': 'off',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      // __filename y __dirname son la forma estandar de obtener rutas en ES modules
      'no-underscore-dangle': ['error', { allow: ['__filename', '__dirname'] }],
      // se permiten los avisos intencionales con warn y error
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      // dos routers se importan con nombres distintos
      'import-x/no-rename-default': 'off',
    },
  },
  // 7) los helpers de handlebars son sincronos, por eso se lee el manifest con fs sync
  {
    name: 'proyecto/vite-helper',
    files: ['lib/vite.js'],
    rules: { 'n/no-sync': 'off' },
  },
]);
