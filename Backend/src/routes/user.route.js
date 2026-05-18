const express = require('express');
const { registerController, loginController, emailVerification, forgotPassword, verifyResetOtp, resetPassword } = require('../controllers/auth.controllers');
const router = express.Router();

router.post('/register', registerController);
router.post('/login', loginController);
router.post('/email-verification', emailVerification);
router.post('/forgot-password', forgotPassword);
router.post('/verify-reset-otp', verifyResetOtp);
router.post('/reset-password', resetPassword);

module.exports = router;