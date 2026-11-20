const { query } = require('../config/db');

const CourseModel = {
  async getAll() {
    const sql = `
      SELECT c.*, COUNT(s.id) AS student_count
      FROM courses c
      LEFT JOIN students s ON c.id = s.course_id
      GROUP BY c.id
      ORDER BY c.created_at DESC
    `;
    return query(sql);
  },

  async getById(id) {
    const rows = await query('SELECT * FROM courses WHERE id = ? LIMIT 1', [id]);
    return rows[0] || null;
  },

  async getByCode(code) {
    const rows = await query('SELECT * FROM courses WHERE code = ? LIMIT 1', [code]);
    return rows[0] || null;
  },

  async create({ code, name, department, duration, credits, description, status = 'active' }) {
    const result = await query(
      `INSERT INTO courses (code, name, department, duration, credits, description, status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [code, name, department, duration, credits, description || '', status]
    );
    return this.getById(result.insertId);
  },

  async update(id, { code, name, department, duration, credits, description, status }) {
    await query(
      `UPDATE courses
       SET code = ?, name = ?, department = ?, duration = ?, credits = ?, description = ?, status = ?
       WHERE id = ?`,
      [code, name, department, duration, credits, description || '', status, id]
    );
    return this.getById(id);
  },

  async delete(id) {
    await query('DELETE FROM courses WHERE id = ?', [id]);
    return true;
  },

  async count() {
    const rows = await query('SELECT COUNT(*) AS total FROM courses');
    return rows[0]?.total || 0;
  }
};

module.exports = CourseModel;
