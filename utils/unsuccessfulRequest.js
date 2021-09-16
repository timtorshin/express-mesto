const unsuccessfulRequest = (res, statusCode, errorMessage) => {
  res.status(statusCode).send({ message: errorMessage });
};

module.exports = unsuccessfulRequest;
