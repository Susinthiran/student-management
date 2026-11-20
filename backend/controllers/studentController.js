const StudentModel = require('../models/studentModel');
const CourseModel = require('../models/courseModel');
const ActivityModel = require('../models/activityModel');

const getStudents = async (req, res) => {
  try {
    const {
      search = '',
      courseId = '',
      status = '',
      page = 1,
      limit = 10,
      sortBy = 'created_at',
      order = 'DESC'
    } = req.query;

    const { students, total } = await StudentModel.getAll({
      search,
      courseId,
      status,
      page: parseInt(page, 10) || 1,
      limit: parseInt(limit, 10) || 10,
      sortBy,
      order
    });

    res.status(200).json({
      success: true,
      data: students,
      pagination: {
        total,
        page: parseInt(page, 10) || 1,
        limit: parseInt(limit, 10) || 10,
        totalPages: Math.ceil(total / (parseInt(limit, 10) || 10))
      }
    });
  } catch (error) {
    console.error('getStudents error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve students records.',
      error: error.message
    });
  }
};

const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await StudentModel.getById(id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student record not found.'
      });
    }

    res.status(200).json({
      success: true,
      data: student
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve student details.',
      error: error.message
    });
  }
};

const createStudent = async (req, res) => {
  try {
    const {
      student_id,
      full_name,
      email,
      phone,
      gender,
      dob,
      course_id,
      address,
      admission_date,
      status = 'Active'
    } = req.body;

    // Check duplicate student_id
    const existingId = await StudentModel.getByStudentId(student_id.trim());
    if (existingId) {
      return res.status(400).json({
        success: false,
        message: `Student ID '${student_id}' is already registered.`
      });
    }

    // Check duplicate email
    const existingEmail = await StudentModel.getByEmail(email.trim());
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: `Email address '${email}' is already registered.`
      });
    }

    // Verify course if provided
    if (course_id) {
      const course = await CourseModel.getById(course_id);
      if (!course) {
        return res.status(400).json({
          success: false,
          message: 'Selected course does not exist.'
        });
      }
    }

    const createdStudent = await StudentModel.create({
      student_id: student_id.trim(),
      full_name: full_name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      gender,
      dob,
      course_id: course_id || null,
      address: address ? address.trim() : '',
      admission_date,
      status
    });

    await ActivityModel.log(
      'STUDENT_CREATED',
      `Enrolled new student: ${full_name} (${student_id})`,
      req.user?.id || 1
    );

    res.status(201).json({
      success: true,
      message: 'Student record created successfully!',
      data: createdStudent
    });
  } catch (error) {
    console.error('createStudent error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create student record.',
      error: error.message
    });
  }
};

const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      student_id,
      full_name,
      email,
      phone,
      gender,
      dob,
      course_id,
      address,
      admission_date,
      status
    } = req.body;

    const existingStudent = await StudentModel.getById(id);
    if (!existingStudent) {
      return res.status(404).json({
        success: false,
        message: 'Student record not found.'
      });
    }

    // Check if new student_id is taken by another student
    if (student_id && student_id.trim() !== existingStudent.student_id) {
      const duplicateId = await StudentModel.getByStudentId(student_id.trim());
      if (duplicateId && duplicateId.id !== Number(id)) {
        return res.status(400).json({
          success: false,
          message: `Student ID '${student_id}' is already registered to another student.`
        });
      }
    }

    // Check if new email is taken by another student
    if (email && email.trim().toLowerCase() !== existingStudent.email.toLowerCase()) {
      const duplicateEmail = await StudentModel.getByEmail(email.trim());
      if (duplicateEmail && duplicateEmail.id !== Number(id)) {
        return res.status(400).json({
          success: false,
          message: `Email address '${email}' is already registered to another student.`
        });
      }
    }

    // Verify course if provided
    if (course_id) {
      const course = await CourseModel.getById(course_id);
      if (!course) {
        return res.status(400).json({
          success: false,
          message: 'Selected course does not exist.'
        });
      }
    }

    const updatedStudent = await StudentModel.update(id, {
      student_id: student_id ? student_id.trim() : existingStudent.student_id,
      full_name: full_name ? full_name.trim() : existingStudent.full_name,
      email: email ? email.trim() : existingStudent.email,
      phone: phone ? phone.trim() : existingStudent.phone,
      gender: gender || existingStudent.gender,
      dob: dob || existingStudent.dob,
      course_id: course_id !== undefined ? (course_id || null) : existingStudent.course_id,
      address: address !== undefined ? address.trim() : existingStudent.address,
      admission_date: admission_date || existingStudent.admission_date,
      status: status || existingStudent.status
    });

    await ActivityModel.log(
      'STUDENT_UPDATED',
      `Updated student: ${updatedStudent.full_name} (${updatedStudent.student_id})`,
      req.user?.id || 1
    );

    res.status(200).json({
      success: true,
      message: 'Student information updated successfully!',
      data: updatedStudent
    });
  } catch (error) {
    console.error('updateStudent error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update student record.',
      error: error.message
    });
  }
};

const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await StudentModel.getById(id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student record not found.'
      });
    }

    await StudentModel.delete(id);

    await ActivityModel.log(
      'STUDENT_DELETED',
      `Removed student record: ${student.full_name} (${student.student_id})`,
      req.user?.id || 1
    );

    res.status(200).json({
      success: true,
      message: `Student '${student.full_name}' deleted successfully.`
    });
  } catch (error) {
    console.error('deleteStudent error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete student record.',
      error: error.message
    });
  }
};

module.exports = {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent
};
