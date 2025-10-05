const User = require('../models/User');
const fs = require('fs').promises;
const path = require('path');

// Get user profile
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update user profile
exports.updateProfile = async (req, res) => {
    try {
        const { name, email } = req.body;

        // Check if email is taken
        if (email) {
            const existingUser = await User.findOne({ email, _id: { $ne: req.user.id } });
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'Email is already taken'
                });
            }
        }

        const user = await User.findById(req.user.id);
        if (name) user.name = name;
        if (email) user.email = email;
        
        await user.save();

        const updatedUser = await User.findById(req.user.id).select('-password');
        
        res.json({
            success: true,
            data: updatedUser
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update user avatar
exports.updateAvatar = async (req, res) => {
    try {
        console.log('Update avatar request received');
        console.log('Request file:', req.file);
        console.log('Request user:', req.user);
        console.log('Upload directory:', path.resolve('public/uploads/avatars'));

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Please upload an image'
            });
        }

        // Verify file was saved
        const filePath = path.join(__dirname, '../../public/uploads/avatars', req.file.filename);
        console.log('Attempting to save file at:', filePath);
        console.log('Current directory:', __dirname);
        console.log('File details:', {
            originalname: req.file.originalname,
            filename: req.file.filename,
            path: req.file.path,
            size: req.file.size
        });

        try {
            await fs.access(filePath);
            const stats = await fs.stat(filePath);
            console.log('File was successfully saved:', {
                path: filePath,
                size: stats.size,
                created: stats.birthtime,
                modified: stats.mtime
            });
        } catch (error) {
            console.error('File was not saved correctly:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to save file'
            });
        }

        const user = await User.findById(req.user.id);

        // Delete old avatar if exists
        if (user.avatar) {
            try {
                await fs.unlink(path.join('public/uploads/avatars', path.basename(user.avatar)));
            } catch (error) {
                console.error('Error deleting old avatar:', error);
            }
        }

        // Update with new avatar
        const avatarUrl = `/uploads/avatars/${req.file.filename}`;
        const absoluteFilePath = path.resolve(process.cwd(), 'public/uploads/avatars', req.file.filename);
        
        try {
            // Check if file exists using async/await
            await fs.access(req.file.path);
            const fileStats = await fs.stat(req.file.path);
            
            console.log('File system check:', {
                originalPath: req.file.path,
                exists: true,
                size: fileStats.size
            });

            // Ensure the destination directory exists
            await fs.mkdir(path.dirname(absoluteFilePath), { recursive: true });
            
            // Copy file to correct location if needed
            if (req.file.path !== absoluteFilePath) {
                await fs.copyFile(req.file.path, absoluteFilePath);
                console.log('Copied file to correct location');
            }
        } catch (error) {
            console.error('File system error:', error);
            throw new Error('Failed to process uploaded file');
        }

        user.avatar = avatarUrl;
        await user.save();

        // Verify user was updated
        const updatedUser = await User.findById(user._id).select('-password');
        console.log('Updated user:', updatedUser);
        
        if (!updatedUser || !updatedUser.avatar) {
            return res.status(500).json({
                success: false,
                message: 'Failed to update user avatar'
            });
        }

        res.json({
            success: true,
            data: updatedUser,
            debug: {
                avatarUrl,
                fileName: req.file.filename,
                filePath: path.join('public/uploads/avatars', req.file.filename)
            }
        });
    } catch (error) {
        // Delete uploaded file if there's an error
        if (req.file) {
            try {
                await fs.unlink(req.file.path);
            } catch (unlinkError) {
                console.error('Error deleting uploaded file:', unlinkError);
            }
        }

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};