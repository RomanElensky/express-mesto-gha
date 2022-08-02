const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.status(200).send(cards);
    })
    .catch((err) => {
      res.status(500).send({ message: 'Нет ответа от сервера' });
    });
};

module.exports.postCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.status(201).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Введены некорректные данные' });
      } else {
        res.status(500).send({ message: 'Нет ответа от сервера' });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (card) {
        res.status(200).send({ card });
      } else {
        res.status(404).send({ message: 'Карточка не найдена' });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(400).send({ message: 'Введены некорректные данные' });
      } else {
        res.status(500).send({ message: 'Нет ответа от сервера' });
      }
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card) {
        res.status(200).send({ card });
      } else {
        res.status(404).send({ message: 'Карточка не найдена' });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(400).send({ message: 'Введены некорректные данные' });
      } else {
        res.status(500).send({ message: 'Нет ответа от сервера' });
      }
    });
};

module.exports.deleteLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card) {
        res.status(200).send({ card });
      } else {
        res.status(404).send({ message: 'Карточка не найдена' });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(400).send({ message: 'Введены некорректные данные' });
      } else {
        res.status(500).send({ message: 'Нет ответа от сервера' });
      }
    });
};
