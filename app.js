const express = require('express');

const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;
const app = express();
const bodyParser = require('body-parser');

const routerUsers = require('./routes/users');
const routerCards = require('./routes/cards');
const { NotFound } = require('./utils/errors');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

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

app.listen(PORT, () => {
  console.log(`Подключен к порту ${PORT}`);
});
