const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const {
  ErrorCode, NotFound, DeafaultError, UnauthorizedError, ConflictError,
} = require('../utils/errors');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send({ users });
    })
    .catch(() => {
      res.status(DeafaultError).send({ message: 'Ошибка по умолчанию' });
    });
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userID)
    .then((user) => {
      if (user) {
        res.send({ user });
      } else {
        res.status(NotFound).send({ message: 'Пользователь по указанному _id не найден' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ErrorCode).send({ message: 'Переданы некорректные данные при поиске пользователя' });
      } else {
        res.status(DeafaultError).send({ message: 'Ошибка по умолчанию' });
      }
    });
};

module.exports.getUser = (req, res) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user) {
        res.send({ user });
      } else {
        res.status(NotFound).send({ message: 'Пользователь по указанному _id не найден' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ErrorCode).send({ message: 'Переданы некорректные данные при поиске пользователя' });
      } else {
        res.status(DeafaultError).send({ message: 'Ошибка по умолчанию' });
      }
    });
};

module.exports.postUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    })
      .then((user) => {
        const newUser = user.toObject();
        delete newUser.password;
        res.send(newUser);
      })
      .catch((err) => {
        if (err.name === 'ValidationError') {
          res.status(ErrorCode).send({ message: 'Переданы некорректные данные при создании пользователя' });
        }
        if (err.code === 11000) {
          res.status(ConflictError).send({ message: 'Такой email уже зарегестрирован' });
        }
      }));
};

module.exports.patchProfile = (req, res) => {
  const { name, about } = req.body;
  User.findOneAndUpdate({ _id: req.user._id }, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      res.send({ user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(NotFound).send({ message: 'Пользователь с указанным _id не найден' });
      } else if (err.name === 'ValidationError') {
        res.status(ErrorCode).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      } else {
        res.status(DeafaultError).send({ message: 'Ошибка по умолчанию' });
      }
    });
};

module.exports.patchAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findOneAndUpdate({ _id: req.user._id }, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      res.send({ user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(NotFound).send({ message: 'Пользователь с указанным _id не найден' });
      } else if (err.name === 'ValidationError') {
        res.status(ErrorCode).send({ message: 'Переданы некорректные данные при обновлении аватара' });
      } else {
        res.status(DeafaultError).send({ message: 'Ошибка по умолчанию' });
      }
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        'some-secret-key',
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch(() => {
      res.status(UnauthorizedError).send({ message: 'Ошибка авторизации' });
    });
};
