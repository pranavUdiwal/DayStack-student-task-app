const User = require('../models/user.model');
const upload = require('../services/storage.service');

const getProfile = async (req, res) => {
    try {
        const user = req.user.toObject();
        delete user.password;
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
        console.log(error.message);
    }
};

const updateProfile = async (req, res) => {
    try {
        const { name, bio, profilePhoto } = req.body;
        
        if (name) req.user.name = name;
        if (bio !== undefined) req.user.bio = bio;
        if (profilePhoto !== undefined) req.user.profilePhoto = profilePhoto;
        
        await req.user.save();
        
        const user = req.user.toObject();
        delete user.password;
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
        console.log(error.message);
    }
};

const uploadPhoto = async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).json({ message: 'Please upload a photo' });
        }

        const uploadResponse = await upload.upload({
            file: file.buffer.toString('base64'),
            fileName: `${req.user._id}-${Date.now()}`
        });

        req.user.profilePhoto = uploadResponse.url;
        await req.user.save();

        res.status(200).json({
            message: 'Photo uploaded successfully',
            profilePhoto: uploadResponse.url
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
        console.log(error.message);
    }
};

module.exports = {
    getProfile,
    updateProfile,
    uploadPhoto
};
