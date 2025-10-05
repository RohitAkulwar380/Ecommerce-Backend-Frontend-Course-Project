const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { protect } = require('../middleware/auth');
const { 
    updateProfile,
    updateAvatar,
    getProfile
} = require('../controller/profile.controller');

// Multer configuration for avatar uploads
const storage = multer.diskStorage({
    destination: async function (req, file, cb) {
        // Get absolute path to the uploads directory
        const uploadPath = path.resolve(process.cwd(), 'public/uploads/avatars');
        
        // Ensure directory exists
        try {
            await fs.promises.access(uploadPath).catch(async () => {
                await fs.promises.mkdir(uploadPath, { recursive: true });
                console.log('Created upload directory:', uploadPath);
            });
        } catch (error) {
            console.error('Error creating upload directory:', error);
            return cb(error);
        }
        
        console.log('Current working directory:', process.cwd());
        console.log('__dirname:', __dirname);
        console.log('Upload path:', uploadPath);
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = file.originalname.split('.').pop()?.toLowerCase() || 'jpg';
        const filename = `avatar-${uniqueSuffix}.${ext}`;
        console.log('Generated filename:', filename);
        cb(null, filename);
    }
})

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 2 * 1024 * 1024 // 2MB limit
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true)
        } else {
            cb(new Error('Not an image! Please upload an image.'), false)
        }
    }
})

// Get profile
router.get('/profile', protect, getProfile);

// Update profile
router.put('/profile', protect, updateProfile);

// Update avatar
router.post('/avatar', protect, upload.single('avatar'), updateAvatar);

module.exports = router;
