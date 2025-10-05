const fs = require('fs');
const path = require('path');

// Ensure upload directories exist
const uploadsPath = path.join(__dirname, '../../public/uploads');
const avatarsPath = path.join(uploadsPath, 'avatars');

if (!fs.existsSync(uploadsPath)) {
    fs.mkdirSync(uploadsPath, { recursive: true });
}
if (!fs.existsSync(avatarsPath)) {
    fs.mkdirSync(avatarsPath, { recursive: true });
}

module.exports = {
    uploadsPath,
    avatarsPath
};