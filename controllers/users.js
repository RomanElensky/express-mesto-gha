const User = require('../models/user');
const { ErrorCode, NotFound, DeafaultError } = require('../utils/errors');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send({ users });
    })
    .catch(() => {
      res.status(DeafaultError).send({ message: 'Нет ответа от сервера' });
    });
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user) {
        res.send({ user });
      } else {
        res.status(NotFound).send({ message: 'Пользователь не найден' });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(ErrorCode).send({ message: 'Введены некорректные данные' });
      } else {
        res.status(DeafaultError).send({ message: 'Нет ответа от сервера' });
      }
    });
};

module.exports.postUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => {
      res.send({ user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ErrorCode).send({ message: 'Введены некорректные данные' });
      } else {
        res.status(DeafaultError).send({ message: 'Нет ответа от сервера' });
      }
    });
};

module.exports.patchProfile = (req, res) => {
  const { name, about } = req.body;

  User.findOneAndUpdate({ _id: req.user._id }, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      res.send({ user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(NotFound).send({ message: 'Пользователь не найден' });
      } else if (err.name === 'ValidationError') {
        res.status(ErrorCode).send({ message: 'Введены некорректные данные' });
      } else {
        res.status(DeafaultError).send({ message: 'Нет ответа от сервера' });
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
        res.status(NotFound).send({ message: 'Пользователь не найден' });
      } else if (err.name === 'ValidationError') {
        res.status(ErrorCode).send({ message: 'Введены некорректные данные' });
      } else {
        res.status(DeafaultError).send({ message: 'Нет ответа от сервера' });
      }
    });
};
