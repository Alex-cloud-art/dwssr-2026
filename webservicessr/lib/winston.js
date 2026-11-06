// Importando el core de winston
import winston, { format } from 'winston';
// Importando path y fs
import path from 'node:path';
import fs from 'node:fs';
// Importando rotación diaria de archivos
import DailyRotateFile from 'winston-daily-rotate-file';

// Desestructura funciones útiles de format
const {
  combine, timestamp, label, printf, colorize, prettyPrint,
} = format;

// Directorio raíz y directorio de logs
const rootdir = path.resolve(process.cwd());
const logDir = path.join(rootdir, 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Definiendo esquema de coloreo
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'blue',
};

// Agregando el esquema a winston
winston.addColors(colors);

// Formato de consola
const myConsoleFormat = combine(
  colorize({ all: true }),
  label({ label: '🔔: ' }),
  timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }),
  printf(
    (info) => `${info.level} ▸ ${info.label} ▸ ${info.timestamp} ▸ ${info.message}`,
  ),
);

// Formato de archivos JSON
const myFileFormat = combine(
  format.uncolorize(),
  timestamp(),
  format.json(),
);

// Configuración de transportes
const options = {
  errorFile: {
    level: 'error',
    filename: path.join(logDir, 'error.log'),
    maxsize: 5242880, // 5MB
    maxFiles: 2,
    format: myFileFormat,
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    format: myConsoleFormat,
  },
  readableFile: {
    level: 'info',
    filename: path.join(logDir, 'readable.log'),
    maxsize: 5242880, // 5MB
    maxFiles: 2,
    format: combine(
      format.uncolorize(),
      timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }),
      prettyPrint(),
    ),
  },
  dailyRotateFile: {
    level: 'info',
    filename: path.join(logDir, 'app-%DATE%.log'),
    datePattern: 'YYYY-MM-DD-HH',
    zippedArchive: true,
    maxSize: '5m',
    maxFiles: 2,
    format: myFileFormat,
  },
};

// Creando logger
const logger = winston.createLogger({
  transports: [
    new DailyRotateFile(options.dailyRotateFile),
    new winston.transports.File(options.readableFile),
    new winston.transports.File(options.errorFile),
    new winston.transports.Console(options.console),
  ],
  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join(logDir, 'exception.log'),
    }),
  ],
  rejectionHandlers: [
    new winston.transports.File({
      filename: path.join(logDir, 'rejection.log'),
    }),
  ],
  exitOnError: false,
});

// Exportamos logger
export default logger;
