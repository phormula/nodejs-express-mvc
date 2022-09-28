const { Router } = require('express');
const AuthController = require('../../controllers/AuthController');
const AuthValidations = require('../validations/auth');
const VendorController = require('../../controllers/VendorController');
const { validate } = require('../../middleware');

const router = Router();

router.route('/all').get(VendorController.getAllVendors);

router.route('/:id').get(VendorController.getVendor);

router.post('/register', validate(AuthValidations.vendorRegisterRules), AuthController.register);

module.exports = router;
