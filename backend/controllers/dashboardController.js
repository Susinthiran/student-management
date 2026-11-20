const StudentModel = require('../models/studentModel');
const CourseModel = require('../models/courseModel');
const ActivityModel = require('../models/activityModel');

const getDashboardStats = async (req, res) => {
  try {
    const [studentStats, totalCourses, recentStudents, coursesWithCount, recentActivities] = await Promise.all([
      StudentModel.getStats(),
      CourseModel.count(),
      StudentModel.getRecent(5),
      CourseModel.getAll(),
      ActivityModel.getRecent(6)
    ]);

    // Format course distribution for chart
    const courseDistribution = coursesWithCount.map(c => ({
      name: c.code,
      fullName: c.name,
      students: Number(c.student_count || 0)
    }));

    // Status distribution
    const statusDistribution = [
      { name: 'Active', value: Number(studentStats.active) },
      { name: 'Inactive', value: Number(studentStats.inactive) },
      { name: 'Suspended', value: Number(studentStats.suspended) }
    ];

    res.status(200).json({
      success: true,
      data: {
        totalStudents: studentStats.total,
        activeStudents: studentStats.active,
        inactiveStudents: studentStats.inactive,
        suspendedStudents: studentStats.suspended,
        totalCourses: totalCourses,
        recentStudents,
        courseDistribution,
        statusDistribution,
        recentActivities
      }
    });
  } catch (error) {
    console.error('getDashboardStats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve dashboard analytics.',
      error: error.message
    });
  }
};

module.exports = {
  getDashboardStats
};
