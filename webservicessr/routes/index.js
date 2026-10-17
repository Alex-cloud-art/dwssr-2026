import express from 'express';
const router = express.Router();

let counter = 0;
const numbers = [];

/* GET home page. */
router.get('/', function (req, res, next) {
  counter++;
  numbers.push(counter);
  res.render('index', {
    title: 'Urbina Cruz Roberto Alexis',
    counter,
    numbers,
  });
});

export default router;
