const express = require('express');

const app = express();

const mongoose = require('mongoose');

const bodyParser = require('body-parser');
const routerUsers = require('./routes/users');
const routerCards = require('./routes/cards');

const { NotFound } = require('./utils/errors');

const { PORT = 3000 } = process.env;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '634a9f09b6c26ed5c1bfbc26',
  };
  next();
});

app.use('/users', routerUsers);
app.use('/cards', routerCards);
app.use('*', (req, res) => {
  res.status(NotFound).send({ message: 'Страница не найдена' });
});

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.listen(PORT, () => {
  console.log(`Подключен к порту ${PORT}`);
});
