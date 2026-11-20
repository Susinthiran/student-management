const express = require('express');
const router = express.Router();
const { login, logout, getMe, updateProfile } = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');
const { validateLogin } = require('../middleware/validateMiddleware');

// Public routes
router.post('/login', validateLogin, login);
router.post('/logout', logout);

// Protected routes
router.get('/me', verifyToken, getMe);
router.put('/profile', verifyToken, updateProfile);

module.exports = router;
