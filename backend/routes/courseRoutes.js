const express = require('express');
const router = express.Router();
const {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse
} = require('../controllers/courseController');
const { verifyToken } = require('../middleware/authMiddleware');
const { validateCourse } = require('../middleware/validateMiddleware');

// All course routes require JWT authentication
router.use(verifyToken);

router.get('/', getCourses);
router.get('/:id', getCourseById);
router.post('/', validateCourse, createCourse);
router.put('/:id', validateCourse, updateCourse);
router.delete('/:id', deleteCourse);

module.exports = router;
