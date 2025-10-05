const router = require('express').Router();
const {register, login, me, logout} = require('..//controller/auth.controller');
const {protect} = require('..//middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/me', protect, me);
router.post('/logout', logout);

module.exports = router;