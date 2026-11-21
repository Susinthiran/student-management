const express = require('express');
const router = express.Router();
const {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse
} = require('../controllers/courseController');
const { verifyToken, requireAdmin } = require('../middleware/authMiddleware');
const { validateCourse } = require('../middleware/validateMiddleware');

// PUBLIC ENDPOINTS: Anyone can view courses without login
router.get('/', getCourses);
router.get('/:id', getCourseById);

// ADMIN PROTECTED: ONLY logged-in Administrator can create, update, or delete courses
router.post('/', verifyToken, requireAdmin, validateCourse, createCourse);
router.put('/:id', verifyToken, requireAdmin, validateCourse, updateCourse);
router.delete('/:id', verifyToken, requireAdmin, deleteCourse);

module.exports = router;
