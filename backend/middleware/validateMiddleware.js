const { validationResult } = require('express-validator');

function validateRequest(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array().map((error) => ({ field: error.param, message: error.msg })) });
  }
  next();
}

module.exports = { validateRequest };
