const { query, isMySQLActive } = require('../config/db');

const ActivityModel = {
  async log(action, details, userId = 1) {
    try {
      await query(
        'INSERT INTO activity_logs (action, details, user_id) VALUES (?, ?, ?)',
        [action, details, userId]
      );
    } catch (err) {
      console.warn('[ActivityModel] Log warning:', err.message);
    }
  },

  async getRecent(limit = 6) {
    const isMySQL = isMySQLActive();
    if (!isMySQL) {
      const logs = await query('SELECT * FROM activity_logs');
      return logs.slice(0, limit);
    }
    const sql = `
      SELECT a.*, u.name as user_name
      FROM activity_logs a
      LEFT JOIN users u ON a.user_id = u.id
      ORDER BY a.created_at DESC
      LIMIT ?
    `;
    return query(sql, [limit]);
  }
};

module.exports = ActivityModel;
