const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const validLink = (value) => {
  const result = validator.isURL(value, { require_protocol: true });
  if (result) {
    return value;
  }
  throw new Error('Введена некорректная ссылка');
};

const {
  getUsers,
  getUser,
  getUserId,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getUser);
router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().hex().length(24),
  }),
}), getUserId);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
}), updateUser);
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().custom(validLink),
  }),
}), updateAvatar);

module.exports = router;
