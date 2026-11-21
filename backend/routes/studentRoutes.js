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

// PUBLIC ENDPOINTS: Anyone (students, visitors, public) can view records without login
router.get('/', getStudents);
router.get('/:id', getStudentById);

// ADMIN PROTECTED: ONLY logged-in Administrator can create, update, or delete records
router.post('/', verifyToken, requireAdmin, validateStudent, createStudent);
router.put('/:id', verifyToken, requireAdmin, validateStudent, updateStudent);
router.delete('/:id', verifyToken, requireAdmin, deleteStudent);

module.exports = router;
