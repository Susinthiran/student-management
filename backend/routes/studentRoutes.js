const express = require('express');
const router = express.Router();
const {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent
} = require('../controllers/studentController');
const { verifyToken } = require('../middleware/authMiddleware');
const { validateStudent } = require('../middleware/validateMiddleware');

// All student routes require JWT authentication
router.use(verifyToken);

router.get('/', getStudents);
router.get('/:id', getStudentById);
router.post('/', validateStudent, createStudent);
router.put('/:id', validateStudent, updateStudent);
router.delete('/:id', deleteStudent);

module.exports = router;
