const User = require('../models/user');
const {
  BAD_REQUEST_ERROR,
  NOT_FOUND_ERROR,
  INTERNAL_SERVER_ERROR,
} = require('../utils/status-codes');
const successfulRequest = require('../utils/successfulRequest');
const unsuccessfulRequest = require('../utils/unsuccessfulRequest');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => successfulRequest(res, users))
    .catch((err) => unsuccessfulRequest(res, INTERNAL_SERVER_ERROR, `Ошибка по умолчанию ${err.message}`));
};

module.exports.getUserId = (req, res) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        return unsuccessfulRequest(res, NOT_FOUND_ERROR, 'Пользователь по указанному _id не найден');
      }
      return successfulRequest(res, user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        unsuccessfulRequest(res, BAD_REQUEST_ERROR, 'Переданы некорректные данные');
      } else {
        unsuccessfulRequest(res, INTERNAL_SERVER_ERROR, `Ошибка по умолчанию ${err.message}`);
      }
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => successfulRequest(res, user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        unsuccessfulRequest(res, BAD_REQUEST_ERROR, 'Переданы некорректные данные при создании пользователя');
      } else {
        unsuccessfulRequest(res, INTERNAL_SERVER_ERROR, `Ошибка по умолчанию ${err.message}`);
      }
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (!user) {
        unsuccessfulRequest(res, NOT_FOUND_ERROR, 'Пользователь с указанным _id не найден');
      } else {
        successfulRequest(res, user);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        unsuccessfulRequest(res, BAD_REQUEST_ERROR, 'Переданы некорректные данные при обновлении профиля');
      } else {
        unsuccessfulRequest(res, INTERNAL_SERVER_ERROR, `Ошибка по умолчанию ${err.message}`);
      }
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (!user) {
        unsuccessfulRequest(res, NOT_FOUND_ERROR, 'Пользователь с указанным _id не найден');
      } else {
        successfulRequest(res, user);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        unsuccessfulRequest(res, BAD_REQUEST_ERROR, 'Переданы некорректные данные при обновлении аватара');
      } else {
        unsuccessfulRequest(res, INTERNAL_SERVER_ERROR, `Ошибка по умолчанию ${err.message}`);
      }
    });
};
