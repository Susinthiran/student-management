const { query } = require('../config/db');

const UserModel = {
  async findByEmail(email) {
    const rows = await query('SELECT * FROM users WHERE email = ? LIMIT 1', [email]);
    return rows[0] || null;
  },

  async findById(id) {
    const rows = await query(
      'SELECT id, name, email, role, avatar, created_at, updated_at FROM users WHERE id = ? LIMIT 1',
      [id]
    );
    return rows[0] || null;
  },

  async updateProfile(id, { name, email, password }) {
    if (password) {
      await query(
        'UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?',
        [name, email, password, id]
      );
    } else {
      await query(
        'UPDATE users SET name = ?, email = ? WHERE id = ?',
        [name, email, id]
      );
    }
    return this.findById(id);
  },

  async create({ name, email, password, role = 'admin' }) {
    const result = await query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, password, role]
    );
    return this.findById(result.insertId);
  }
};

module.exports = UserModel;
