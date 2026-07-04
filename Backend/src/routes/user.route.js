const express = require('express');
const passport = require('passport');
const { registerController, loginController, emailVerification, forgotPassword, verifyResetOtp, resetPassword } = require('../controllers/auth.controllers');
const router = express.Router();

router.post('/register', registerController);
router.post('/login', loginController);
router.post('/email-verification', emailVerification);
router.post('/forgot-password', forgotPassword);
router.post('/verify-reset-otp', verifyResetOtp);
router.post('/reset-password', resetPassword);

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: process.env.FRONTEND_URL ? `${process.env.FRONTEND_URL}/login` : '/login' }),
  (req, res) => {
    const token = req.user.generateJWT();
    
    res.cookie('token', token, { 
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', 
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax' 
    });

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    res.redirect(`${frontendUrl}/auth/google/success?token=${token}`);
  }
);

module.exports = router;