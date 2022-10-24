const express = require('express');

const app = express();

const mongoose = require('mongoose');

require('dotenv').config();

const { errors } = require('celebrate');

const bodyParser = require('body-parser');

const { login, postUser } = require('./controllers/users');
const routerUsers = require('./routes/users');
const routerCards = require('./routes/cards');
const auth = require('./middlewares/auth');
const { validatePostUser, validateLogin } = require('./middlewares/validators');
const { NotFound } = require('./utils/errors');

const { PORT = 3000 } = process.env;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? 'Ошибка сервера' : message,
  });
  next();
});

app.use('/users', routerUsers);
app.use('/cards', routerCards);
app.use('*', (req, res) => {
  res.status(NotFound).send({ message: 'Страница не найдена' });
});
app.use(errors());
app.use(auth);

app.post('/signin', validateLogin, login);
app.post('/signup', validatePostUser, postUser);

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.listen(PORT, () => {
  console.log(`Подключен к порту ${PORT}`);
});
