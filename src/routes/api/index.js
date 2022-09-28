const { Router } = require('express');
const authRouter = require('./auth');
const userRouter = require('./user');
const vendorRouter = require('./vendor');
const adminRouter = require('./admin');
const superAdminRouter = require('./superAdmin');
const UserController = require('../../controllers/UserController');
const { isAdmin, isAuthenticated } = require('../../middleware');

const router = Router();

router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use('/vendor', vendorRouter);
router.use('/admin', adminRouter);
router.use('/super-admin', superAdminRouter);

router.get('/mail-templates', isAuthenticated, isAdmin, UserController.getMailTemplates);

module.exports = router;
