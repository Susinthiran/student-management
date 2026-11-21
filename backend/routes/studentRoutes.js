const express = require('express');
const router = express.Router();
const {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent
} = require('../controllers/studentController');
const { verifyToken, requireAdmin } = require('../middleware/authMiddleware');
const { validateStudent } = require('../middleware/validateMiddleware');

// All student routes require JWT authentication
router.use(verifyToken);

// Students and Admins can view records
router.get('/', getStudents);
router.get('/:id', getStudentById);

// Only Administrators can create, edit, or delete records
router.post('/', requireAdmin, validateStudent, createStudent);
router.put('/:id', requireAdmin, validateStudent, updateStudent);
router.delete('/:id', requireAdmin, deleteStudent);

module.exports = router;
