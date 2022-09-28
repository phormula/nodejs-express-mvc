const { Router } = require('express');
const path = require('path');
const { validate, isPassResetToken } = require('../../middleware');
const AuthValidations = require('../validations/auth');
const AuthController = require('../../controllers/AuthController');

const router = Router();

router.get('^/$|/index(.html)?', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'views', 'index.html'));
});
router.get('/auth/resetpass', validate(AuthValidations.changePasswordPageRules), isPassResetToken, (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'views', 'reset.html'));
});
router.post(
  '/auth/resetpass',
  validate(AuthValidations.resetPasswordRules),
  isPassResetToken,
  AuthController.resetPassword,
);

module.exports = router;
