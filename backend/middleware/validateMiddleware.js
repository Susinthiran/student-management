const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !email.trim()) {
    return res.status(400).json({ success: false, message: 'Email address is required.' });
  }
  if (!validateEmail(email)) {
    return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
  }
  if (!password || !password.trim()) {
    return res.status(400).json({ success: false, message: 'Password is required.' });
  }
  next();
};

const validateStudent = (req, res, next) => {
  const { student_id, full_name, email, phone, gender, dob, admission_date } = req.body;

  if (!student_id || !student_id.trim()) {
    return res.status(400).json({ success: false, message: 'Student ID is required.' });
  }
  if (!full_name || !full_name.trim()) {
    return res.status(400).json({ success: false, message: 'Full name is required.' });
  }
  if (!email || !email.trim()) {
    return res.status(400).json({ success: false, message: 'Email is required.' });
  }
  if (!validateEmail(email)) {
    return res.status(400).json({ success: false, message: 'Invalid email address format.' });
  }
  if (!phone || !phone.trim()) {
    return res.status(400).json({ success: false, message: 'Phone number is required.' });
  }
  if (!gender) {
    return res.status(400).json({ success: false, message: 'Gender selection is required.' });
  }
  if (!dob) {
    return res.status(400).json({ success: false, message: 'Date of birth is required.' });
  }
  if (!admission_date) {
    return res.status(400).json({ success: false, message: 'Admission date is required.' });
  }

  next();
};

const validateCourse = (req, res, next) => {
  const { code, name, department, duration } = req.body;

  if (!code || !code.trim()) {
    return res.status(400).json({ success: false, message: 'Course Code is required (e.g. CS101).' });
  }
  if (!name || !name.trim()) {
    return res.status(400).json({ success: false, message: 'Course Name is required.' });
  }
  if (!department || !department.trim()) {
    return res.status(400).json({ success: false, message: 'Department is required.' });
  }
  if (!duration || !duration.trim()) {
    return res.status(400).json({ success: false, message: 'Course Duration is required.' });
  }

  next();
};

module.exports = {
  validateLogin,
  validateStudent,
  validateCourse
};
