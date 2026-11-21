const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/dashboardController');

// PUBLIC ENDPOINT: Anyone can view dashboard metrics & overview without login
router.get('/stats', getDashboardStats);

module.exports = router;
