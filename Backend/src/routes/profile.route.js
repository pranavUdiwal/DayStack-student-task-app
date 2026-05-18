const express = require('express');
const multer = require('multer');
const {
    getProfile,
    updateProfile,
    uploadPhoto
} = require('../controllers/profile.controllers');
const auth = require('../middlewares/auth.middleware');

const router = express.Router();
const uploadMiddleware = multer({ storage: multer.memoryStorage() });

router.get('/', auth, getProfile);
router.put('/', auth, updateProfile);
router.post('/upload-photo', auth, uploadMiddleware.single('photo'), uploadPhoto);

module.exports = router;
