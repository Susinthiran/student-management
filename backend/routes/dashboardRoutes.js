const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/dashboardController');
const { verifyToken } = require('../middleware/authMiddleware');

// Dashboard analytics require authentication
router.use(verifyToken);

router.get('/stats', getDashboardStats);

module.exports = router;
