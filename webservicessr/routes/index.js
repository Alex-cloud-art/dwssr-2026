import express from 'express';

const router = express.Router();

let counter = 0;
const numbers = [];

/* GET home page. */
// eslint-disable-next-line no-unused-vars
router.get('/', (req, res, next) => {
  counter += 1;
  numbers.push(counter);
  res.render('index', {
    title: 'Urbina Cruz Roberto Alexis',
    counter,
    numbers,
  });
});

export default router;
