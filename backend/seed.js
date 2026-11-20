const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

async function seedAdmin() {
  const host = process.env.DB_HOST || 'localhost';
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASSWORD || '';
  const port = Number(process.env.DB_PORT) || 3306;
  const dbName = process.env.DB_NAME || 'student_management';

  console.log('--- Creating / Resetting Super Admin Account ---');

  try {
    const connection = await mysql.createConnection({
      host,
      user,
      password,
      port,
      database: dbName
    });

    const adminEmail = 'admin@sms.edu';
    const rawPass = 'admin123';
    const hashedPassword = await bcrypt.hash(rawPass, 10);

    const [existing] = await connection.query('SELECT * FROM users WHERE email = ?', [adminEmail]);

    if (existing.length > 0) {
      await connection.query('UPDATE users SET password = ?, role = "admin" WHERE email = ?', [hashedPassword, adminEmail]);
      console.log(`Admin user '${adminEmail}' already existed; password reset to '${rawPass}'.`);
    } else {
      await connection.query(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        ['System Administrator', adminEmail, hashedPassword, 'admin']
      );
      console.log(`Created new Admin user: '${adminEmail}' with password: '${rawPass}'.`);
    }

    await connection.end();
    console.log('Seed completed successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding admin in MySQL:', err.message);
    process.exit(1);
  }
}

seedAdmin();
