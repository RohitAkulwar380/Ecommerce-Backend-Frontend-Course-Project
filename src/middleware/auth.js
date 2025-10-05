const jwt = require('jsonwebtoken');
const User = require('../models/User');
const {ROLES} = require('../utils/roles');

async function protect(req, res, next){
    try{
        console.log('Auth headers:', req.headers);
        console.log('Cookies:', req.cookies);
        
        let token;
        const auth = req.headers.authorization || '';
        
        if (auth.startsWith('Bearer ')) {
            token = auth.substring(7);
        } else if (req.cookies.token) {
            token = req.cookies.token;
        }

        console.log('Token found:', !!token);
        
        if(!token) {
            return res.status(401).json({
                success: false, 
                message: 'Not authorized - No token provided'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded token:', decoded);

        const user = await User.findById(decoded.id).select('-password');
        if(!user) {
            return res.status(401).json({
                success: false, 
                message: 'User not found'
            });
        }

        console.log('User found:', user._id);
        req.user = user;
        next();
    } catch(err) {
        console.error('Auth error:', err);
        return res.status(401).json({
            success: false, 
            message: 'Invalid token or authentication failed'
        });
    }
}

function authorize(...allowed){
    return(req,res,next) => {
        if(!req.user) return res.status(401).json({success:false, message: 'Not Authenticated'});
        if(!allowed.includes(req.user.role)) {
            return res.status(401).json({success:false, message:'Forbidden'});
        }
        next();
    };
}

module.exports = {protect, authorize, ROLES}