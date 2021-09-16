const Card = require('../models/card');
const {
  BAD_REQUEST_ERROR,
  NOT_FOUND_ERROR,
  INTERNAL_SERVER_ERROR,
} = require('../utils/status-codes');
const successfulRequest = require('../utils/successfulRequest');
const unsuccessfulRequest = require('../utils/unsuccessfulRequest');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => successfulRequest(res, cards))
    .catch((err) => unsuccessfulRequest(res, INTERNAL_SERVER_ERROR, `Ошибка по умолчанию ${err.message}`));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => {
      successfulRequest(res, card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        unsuccessfulRequest(res, BAD_REQUEST_ERROR, 'Переданы некорректные данные при создании карточки');
      } else {
        unsuccessfulRequest(res, INTERNAL_SERVER_ERROR, `Ошибка по умолчанию ${err.message}`);
      }
    });
};

module.exports.deleteCardId = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((data) => {
      if (!data) {
        return unsuccessfulRequest(res, NOT_FOUND_ERROR, 'Карточка с указанным _id не найдена');
      }
      return successfulRequest(res, { message: 'Карточка удалена' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        unsuccessfulRequest(res, BAD_REQUEST_ERROR, 'Переданы некорректные данные');
      }
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((data) => {
      if (!data) {
        return unsuccessfulRequest(res, NOT_FOUND_ERROR, 'Карточка с указанным _id не найдена');
      }
      return successfulRequest(res, { message: 'Лайк карточке поставлен' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        unsuccessfulRequest(res, BAD_REQUEST_ERROR, 'Переданы некорректные данные для постановки лайка');
      } else {
        unsuccessfulRequest(res, INTERNAL_SERVER_ERROR, `Ошибка по умолчанию ${err.message}`);
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((data) => {
      if (!data) {
        return unsuccessfulRequest(res, NOT_FOUND_ERROR, 'Карточка с указанным _id не найдена');
      }
      return successfulRequest(res, { message: 'Лайк с карточки убран' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        unsuccessfulRequest(res, BAD_REQUEST_ERROR, 'Переданы некорректные данные для снятия лайка');
      } else {
        unsuccessfulRequest(res, INTERNAL_SERVER_ERROR, `Ошибка по умолчанию ${err.message}`);
      }
    });
};
