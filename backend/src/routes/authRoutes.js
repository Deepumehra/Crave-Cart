const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/signup', authController.register);
router.post('/signin', authController.login);
router.post('/reset-password', authController.resetPassword);
router.post('/reset-password-request', authController.resetPasswordRequest);
router.get('/getAllCustomers',authController.getAllCustomers);
module.exports = router;
