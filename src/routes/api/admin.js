const { Router } = require('express');
const AuthController = require('../../controllers/AuthController');
const AuthValidations = require('../validations/auth');
const VendorController = require('../../controllers/VendorController');
const { isAdmin, isAuthenticated, validate } = require('../../middleware');

const router = Router();

router.route('/all').get(VendorController.getAllVendors);

router.route('/:id').get(VendorController.getVendor);

router.post(
  '/register',
  isAuthenticated,
  isAdmin,
  validate(AuthValidations.adminRegisterRules),
  AuthController.register,
);

module.exports = router;
