const express = require('express');
const app = express();
const { PORT = 3000 } = process.env;
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routerUsers = require('./routes/users');
const routerCards = require('./routes/cards');

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/users', routerUsers);
app.use('/cards', routerCards);

app.use('*', (req, res) => {
  res.status(404).send({ message: 'Страница не найдена' });
});

app.use((req, res, next) => {
  req.user = {
    _id: '62e8cec40a94085632b3de5f',
  };
  next();
});

app.listen(PORT, () => {
  console.log('PORT подключен');
});