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

// All course routes require JWT authentication
router.use(verifyToken);

// Students and Admins can view courses
router.get('/', getCourses);
router.get('/:id', getCourseById);

// Only Administrators can create, edit, or delete courses
router.post('/', requireAdmin, validateCourse, createCourse);
router.put('/:id', requireAdmin, validateCourse, updateCourse);
router.delete('/:id', requireAdmin, deleteCourse);

module.exports = router;
