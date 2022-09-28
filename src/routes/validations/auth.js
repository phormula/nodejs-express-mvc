const { body, query } = require('express-validator');

class AuthValidations {
  loginRules = [body('email').isEmail().exists(), body('password').exists()];

  resetPasswordRequestRules = [body('email').isEmail().exists()];

  changePasswordPageRules = [query('token').exists()];

  resetPasswordRules = [body('newPassword').exists(), body('confirmPassword').exists(), body('token').exists()];

  #commonRegisterRules = [
    body('first_name').exists(),
    body('last_name').exists(),
    body('email').isEmail().exists(),
    body('password').isLength({ min: 6 }).exists(),
  ];

  customerRegisterRules = [...this.#commonRegisterRules, body('role').isIn(['customer']).optional()];

  vendorRegisterRules = [...this.#commonRegisterRules, body('role').isIn(['vendor']).exists()];

  adminRegisterRules = [...this.#commonRegisterRules, body('role').isIn(['admin', 'vendor', 'customer']).exists()];

  superAdminRegisterRules = [
    ...this.#commonRegisterRules,
    body('role').isIn(['super-admin', 'admin', 'vendor', 'customer']).exists(),
  ];

  updateProfileRules = [body('name').optional(), body('email').isEmail().optional()];

  changePasswordRules = [body('current').exists(), body('password').isLength({ min: 6 }).exists()];
}

module.exports = new AuthValidations();
