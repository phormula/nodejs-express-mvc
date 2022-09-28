const { Router } = require('express');
const UserController = require('../../controllers/UserController');
const { isAdmin, isAuthenticated, validate } = require('../../middleware');

const router = Router();

router.route('/all').get(isAuthenticated, isAdmin, UserController.getAllUsers);
router.route('/roles').get(isAuthenticated, isAdmin, UserController.getUserRoles);
// .post(employeesController.createNewEmployee)
// .put(employeesController.updateEmployee)
// .delete(employeesController.deleteEmployee);

router.route('/:id').get(UserController.getUser);

module.exports = router;
