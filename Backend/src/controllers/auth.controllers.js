const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const sendMailTo = require('../services/email.service');

const registerController = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please fill all the fields' });
        }

        const isExist = await User.findOne({ email });

        if (isExist) {
            return res.status(400).json({ message: 'User already exists with this email!' });
        }

        const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            name,
            email,
            password: hashedPassword
        });

        res.cookie('token', token);

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
        console.log(error);
    }
};

const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Please fill all the fields' });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found with this email!' });
        }

        const decoded = await bcrypt.compare(password, user.password);

        if (!decoded) {
            return res.status(401).json({ message: 'Invalid Credentials' });
        }

        const token = await user.generateJWT();
        res.cookie('token', token);
        res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
        console.log(error);
    }
};

const emailVerification = async (req, res) => {
    try {
        const userEmail = req.body.email;

        if (!userEmail) {
            return res.status(400).json({ message: 'Please provide email' });
        }

        const otp = Math.floor(100000 + Math.random() * 900000);

        sendMailTo(userEmail, 'Email Verification', `<h1>Your OTP for email verification is ${otp}</h1>`);

        res.status(200).json({ message: 'Verification email sent successfully' });

        return otp;
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
        console.log(error.message);
    }
};

const forgotPassword = async (req, res) => {
    try {
        const { userEmail } = req.body;

        if (!userEmail) {
            return res.status(400).json({ message: 'Please provide email' });
        }

        const user = await User.findOne({ email: userEmail });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const otp = Math.floor(100000 + Math.random() * 900000);

        sendMailTo(userEmail, 'Email Verification for Password Reset', `<h1>Your OTP for email verification is ${otp}</h1>`);

        user.resetOtp = otp;
        user.resetOtpExpiry = Date.now() + 10 * 60 * 1000;
        await user.save();

        return res.status(200).json({ message: 'OTP sent to email successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
        console.log(error.message);
    }
};

const verifyResetOtp = async (req, res) => {
    try {
        const { otp } = req.body;
        if (!otp) {
            return res.status(400).json({ message: 'Please provide OTP' });
        }

        const user = await User.findOne({ resetOtp: otp, resetOtpExpiry: { $gt: Date.now() } });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        return res.status(200).json({ message: 'OTP verified successfully', email: user.email });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
        console.log(error.message);
    }
};

const resetPassword = async (req, res) => {
    try {
        const { newPassword, email } = req.body;
        if (!newPassword) {
            return res.status(400).json({ message: 'Please provide a new password' });
        }

        const newHashedPassword = await bcrypt.hash(newPassword, 10);

        await User.findOneAndUpdate(
            { email },
            {
                password: newHashedPassword,
                resetOtp: undefined,
                resetOtpExpiry: undefined
            }
        );

        return res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
        console.log(error.message);
    }
};

module.exports = {
    registerController,
    loginController,
    emailVerification,
    forgotPassword,
    verifyResetOtp,
    resetPassword
};