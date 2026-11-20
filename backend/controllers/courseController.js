const CourseModel = require('../models/courseModel');
const ActivityModel = require('../models/activityModel');

const getCourses = async (req, res) => {
  try {
    const courses = await CourseModel.getAll();
    res.status(200).json({
      success: true,
      data: courses
    });
  } catch (error) {
    console.error('getCourses error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve courses list.',
      error: error.message
    });
  }
};

const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await CourseModel.getById(id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found.'
      });
    }

    res.status(200).json({
      success: true,
      data: course
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve course details.',
      error: error.message
    });
  }
};

const createCourse = async (req, res) => {
  try {
    const { code, name, department, duration, credits = 3, description = '', status = 'active' } = req.body;

    const existingCode = await CourseModel.getByCode(code.trim());
    if (existingCode) {
      return res.status(400).json({
        success: false,
        message: `Course Code '${code}' already exists.`
      });
    }

    const createdCourse = await CourseModel.create({
      code: code.trim().toUpperCase(),
      name: name.trim(),
      department: department.trim(),
      duration: duration.trim(),
      credits: parseInt(credits, 10) || 3,
      description: description.trim(),
      status
    });

    await ActivityModel.log(
      'COURSE_CREATED',
      `Established new course: ${createdCourse.name} (${createdCourse.code})`,
      req.user?.id || 1
    );

    res.status(201).json({
      success: true,
      message: 'Course created successfully!',
      data: createdCourse
    });
  } catch (error) {
    console.error('createCourse error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create course.',
      error: error.message
    });
  }
};

const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { code, name, department, duration, credits, description, status } = req.body;

    const existingCourse = await CourseModel.getById(id);
    if (!existingCourse) {
      return res.status(404).json({
        success: false,
        message: 'Course not found.'
      });
    }

    if (code && code.trim().toUpperCase() !== existingCourse.code.toUpperCase()) {
      const duplicateCode = await CourseModel.getByCode(code.trim().toUpperCase());
      if (duplicateCode && duplicateCode.id !== Number(id)) {
        return res.status(400).json({
          success: false,
          message: `Course Code '${code}' is already assigned to another course.`
        });
      }
    }

    const updatedCourse = await CourseModel.update(id, {
      code: code ? code.trim().toUpperCase() : existingCourse.code,
      name: name ? name.trim() : existingCourse.name,
      department: department ? department.trim() : existingCourse.department,
      duration: duration ? duration.trim() : existingCourse.duration,
      credits: credits !== undefined ? parseInt(credits, 10) : existingCourse.credits,
      description: description !== undefined ? description.trim() : existingCourse.description,
      status: status || existingCourse.status
    });

    await ActivityModel.log(
      'COURSE_UPDATED',
      `Modified course: ${updatedCourse.name} (${updatedCourse.code})`,
      req.user?.id || 1
    );

    res.status(200).json({
      success: true,
      message: 'Course updated successfully!',
      data: updatedCourse
    });
  } catch (error) {
    console.error('updateCourse error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update course.',
      error: error.message
    });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await CourseModel.getById(id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found.'
      });
    }

    await CourseModel.delete(id);

    await ActivityModel.log(
      'COURSE_DELETED',
      `Deleted course: ${course.name} (${course.code})`,
      req.user?.id || 1
    );

    res.status(200).json({
      success: true,
      message: `Course '${course.name}' deleted successfully.`
    });
  } catch (error) {
    console.error('deleteCourse error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete course.',
      error: error.message
    });
  }
};

module.exports = {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse
};
