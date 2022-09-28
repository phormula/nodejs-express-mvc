const authenticationMiddleware = require('./authentication');
const isAuthenticated = require('./isAuthenticated');
const isAdmin = require('./isAdmin');
const isSuperAdmin = require('./isSuperAdmin');
const validate = require('./validate');
const isPassResetToken = require('./isPassResetToken');

module.exports = { authenticationMiddleware, isAuthenticated, isAdmin, isSuperAdmin, validate, isPassResetToken };
