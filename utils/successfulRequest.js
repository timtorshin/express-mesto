const { STATUS_OK } = require('./status-codes');

const successfulRequest = (res, data) => {
  res.status(STATUS_OK).send(data);
};

module.exports = successfulRequest;
