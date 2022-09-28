const createError = require('http-errors');

module.exports = async (req, res, next) => {
  if (!req.user) {
    const error = createError(401, 'Not authenticated!');
    return next(error);
  }
  return next();
};
