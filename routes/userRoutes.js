const express = require('express');
const userControllers = require('..//controllers/userControllers');
const authController = require('..//controllers/authController');
const bookingRouter = require('../routes/bookingRoutes');

const router = express.Router();

router.use('/:userId/bookings', bookingRouter);

router.post('/signup', authController.signUp);
router.post('/login', authController.login);
router.get('/logout', authController.logOut);
router.post('/forgotpassword', authController.forgotPassword);
router.patch('/resetpassword/:token', authController.resetPassword);

// Protect all routes after this middleware
router.use(authController.protect);

router.patch('/updateMyPassword', authController.updatePassword);

router.get('/me', userControllers.getMe, userControllers.getUser);
router.patch(
  '/updateMe',
  userControllers.uploadUserPhoto,
  userControllers.resizeUserPhoto,
  userControllers.updateMe
);
router.delete('/deleteMe', userControllers.deleteMe);

// Restrict routes after this middleware to Admins
router.use(authController.restrictTo('admin'));

router
  .route('/')
  .get(userControllers.getAllUsers)
  .post(userControllers.createUser);

router
  .route('/:id')
  .get(userControllers.getUser)
  .patch(userControllers.updateUser)
  .delete(userControllers.deleteUser);

module.exports = router;
