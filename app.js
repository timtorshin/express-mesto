const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const helmet = require('helmet');
const validator = require('validator');
const { celebrate, Joi, errors } = require('celebrate');
const { login, createUser } = require('./controllers/users');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const auth = require('./middlewares/auth');
const error = require('./middlewares/error');
const NotFoundError = require('./utils/NotFoundError');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');

const validEmail = (value) => {
  const result = validator.isEmail(value);
  if (result) {
    return value;
  }
  throw new Error('Введён некорректный email');
};
const validLink = (value) => {
  const result = validator.isURL(value);
  if (result) {
    return value;
  }
  throw new Error('Введена некорректная ссылка');
};

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(helmet());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(require('./middlewares/cors'));

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().custom(validEmail),
    password: Joi.string().required(),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().custom(validEmail),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom(validLink),
  }),
}), createUser);

app.use(auth);

// http://localhost:3000/users
app.use('/users', userRouter);
// http://localhost:3000/cards
app.use('/cards', cardRouter);

app.use(errorLogger);

// non-existent route
app.use('*', () => {
  throw new NotFoundError('Запрашиваемый ресурс не найден');
});

app.use(errors());
app.use(error);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
