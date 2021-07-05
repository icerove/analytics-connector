const { validationResult } = require('express-validator');

const validationErrorHandler = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  next();
};

function PhotoFormatNotSupport(message) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = message;
}

const { inherits } = require('util');
inherits(PhotoFormatNotSupport, Error);

const adminCheck = (token) => {
  if (token === process.env.UPDATE_TOKEN) {
    return ture;
  }
  return false;
};

module.exports = { validationErrorHandler, PhotoFormatNotSupport, adminCheck };
