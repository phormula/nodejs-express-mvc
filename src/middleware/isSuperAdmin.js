const createError = require('http-errors');
const Role = require('../model/Role');
const { getCommonIds } = require('../helpers');

module.exports = async (req, res, next) => {
  try {
    const roleId = await Role.query().select('id').findOne({ name: 'super-admin' });
    const hasAccess = getCommonIds([roleId], req.user.roles);
    if (!hasAccess.length) {
      const error = createError(401, 'Not authorized!');

      return next(error);
    }
  } catch (err) {
    return next({ status: 500, ...err });
  }
  return next();
};
