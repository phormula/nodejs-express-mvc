const { Router } = require('express');
const AuthController = require('../../controllers/AuthController');
const AuthValidations = require('../validations/auth');
const { isAdmin, isAuthenticated, validate } = require('../../middleware');

const router = Router();

router.post('/login', validate(AuthValidations.loginRules), AuthController.login);
router.post('/resetpass', validate(AuthValidations.resetPasswordRequestRules), AuthController.resetPassRequest);

router.post('/register', validate(AuthValidations.customerRegisterRules), AuthController.register);

router
  .route('/me')
  .get(isAuthenticated, isAdmin, AuthController.getCurrentUser)
  .put(isAuthenticated, validate(AuthValidations.updateProfileRules), AuthController.updateCurrentUser)
  .delete(isAuthenticated, isAdmin, AuthController.deleteCurrentUser);

router.put(
  '/me/password',
  isAuthenticated,
  validate(AuthValidations.changePasswordRules),
  AuthController.updatePassword,
);

module.exports = router;
