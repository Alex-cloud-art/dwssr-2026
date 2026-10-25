import express from 'express';

const router = express.Router();

/* GET users listing. */
// eslint-disable-next-line no-unused-vars
router.get('/', (req, res, next) => {
  res.send('<h1 style="color:blue;">LISTA DE USUARIOS</h1>');
});

export default router;
