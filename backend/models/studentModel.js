const { query, isMySQLActive } = require('../config/db');

const StudentModel = {
  async getAll({ search = '', courseId = '', status = '', page = 1, limit = 10, sortBy = 'created_at', order = 'DESC' } = {}) {
    const offset = (page - 1) * limit;
    const isMySQL = isMySQLActive();

    if (!isMySQL) {
      // In-memory / Fallback adapter filter handling
      let all = await query('SELECT * FROM students');
      if (search) {
        const s = search.toLowerCase();
        all = all.filter(item => 
          (item.full_name && item.full_name.toLowerCase().includes(s)) ||
          (item.student_id && item.student_id.toLowerCase().includes(s)) ||
          (item.email && item.email.toLowerCase().includes(s))
        );
      }
      if (courseId) {
        all = all.filter(item => String(item.course_id) === String(courseId));
      }
      if (status && status !== 'all') {
        all = all.filter(item => item.status.toLowerCase() === status.toLowerCase());
      }

      // Sort
      all.sort((a, b) => {
        const valA = a[sortBy] || '';
        const valB = b[sortBy] || '';
        if (order.toUpperCase() === 'ASC') {
          return valA > valB ? 1 : -1;
        }
        return valA < valB ? 1 : -1;
      });

      const total = all.length;
      const paginated = all.slice(offset, offset + Number(limit));
      return { students: paginated, total };
    }

    // Direct MySQL Parameterized Query
    let sql = `
      SELECT s.*, c.name AS course_name, c.code AS course_code, c.department
      FROM students s
      LEFT JOIN courses c ON s.course_id = c.id
      WHERE 1=1
    `;
    let countSql = `
      SELECT COUNT(*) AS total
      FROM students s
      WHERE 1=1
    `;
    const params = [];
    const countParams = [];

    if (search && search.trim() !== '') {
      const searchWildcard = `%${search.trim()}%`;
      sql += ' AND (s.full_name LIKE ? OR s.student_id LIKE ? OR s.email LIKE ?)';
      countSql += ' AND (s.full_name LIKE ? OR s.student_id LIKE ? OR s.email LIKE ?)';
      params.push(searchWildcard, searchWildcard, searchWildcard);
      countParams.push(searchWildcard, searchWildcard, searchWildcard);
    }

    if (courseId && courseId !== '' && courseId !== 'all') {
      sql += ' AND s.course_id = ?';
      countSql += ' AND s.course_id = ?';
      params.push(courseId);
      countParams.push(courseId);
    }

    if (status && status !== '' && status !== 'all') {
      sql += ' AND s.status = ?';
      countSql += ' AND s.status = ?';
      params.push(status);
      countParams.push(status);
    }

    // Sorting safe list
    const allowedSortFields = ['id', 'student_id', 'full_name', 'admission_date', 'status', 'created_at'];
    const safeSortBy = allowedSortFields.includes(sortBy) ? `s.${sortBy}` : 's.created_at';
    const safeOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    sql += ` ORDER BY ${safeSortBy} ${safeOrder} LIMIT ? OFFSET ?`;
    params.push(Number(limit), Number(offset));

    const [students, countResult] = await Promise.all([
      query(sql, params),
      query(countSql, countParams)
    ]);

    const total = countResult[0]?.total || 0;
    return { students, total };
  },

  async getById(id) {
    const sql = `
      SELECT s.*, c.name AS course_name, c.code AS course_code, c.department
      FROM students s
      LEFT JOIN courses c ON s.course_id = c.id
      WHERE s.id = ?
      LIMIT 1
    `;
    const rows = await query(sql, [id]);
    return rows[0] || null;
  },

  async getByStudentId(studentId) {
    const rows = await query('SELECT * FROM students WHERE student_id = ? LIMIT 1', [studentId]);
    return rows[0] || null;
  },

  async getByEmail(email) {
    const rows = await query('SELECT * FROM students WHERE email = ? LIMIT 1', [email]);
    return rows[0] || null;
  },

  async create({ student_id, full_name, email, phone, gender, dob, course_id, address, admission_date, status = 'Active' }) {
    const sql = `
      INSERT INTO students (student_id, full_name, email, phone, gender, dob, course_id, address, admission_date, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const result = await query(sql, [
      student_id,
      full_name,
      email,
      phone,
      gender,
      dob,
      course_id || null,
      address,
      admission_date,
      status
    ]);
    return this.getById(result.insertId);
  },

  async update(id, { student_id, full_name, email, phone, gender, dob, course_id, address, admission_date, status }) {
    const sql = `
      UPDATE students
      SET student_id = ?, full_name = ?, email = ?, phone = ?, gender = ?, dob = ?, course_id = ?, address = ?, admission_date = ?, status = ?
      WHERE id = ?
    `;
    await query(sql, [
      student_id,
      full_name,
      email,
      phone,
      gender,
      dob,
      course_id || null,
      address,
      admission_date,
      status,
      id
    ]);
    return this.getById(id);
  },

  async delete(id) {
    await query('DELETE FROM students WHERE id = ?', [id]);
    return true;
  },

  async getStats() {
    const totalRow = await query('SELECT COUNT(*) AS total FROM students');
    const activeRow = await query("SELECT COUNT(*) AS total FROM students WHERE status = 'Active'");
    const inactiveRow = await query("SELECT COUNT(*) AS total FROM students WHERE status = 'Inactive'");
    const suspendedRow = await query("SELECT COUNT(*) AS total FROM students WHERE status = 'Suspended'");

    return {
      total: totalRow[0]?.total || 0,
      active: activeRow[0]?.total || 0,
      inactive: inactiveRow[0]?.total || 0,
      suspended: suspendedRow[0]?.total || 0
    };
  },

  async getRecent(limit = 5) {
    const isMySQL = isMySQLActive();
    if (!isMySQL) {
      const all = await query('SELECT * FROM students');
      return all.slice(0, limit);
    }
    const sql = `
      SELECT s.*, c.name AS course_name, c.code AS course_code
      FROM students s
      LEFT JOIN courses c ON s.course_id = c.id
      ORDER BY s.created_at DESC
      LIMIT ?
    `;
    return query(sql, [limit]);
  }
};

module.exports = StudentModel;
