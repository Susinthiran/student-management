const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

async function initDatabase() {
  console.log('--- Initializing MySQL Database for Student Management System ---');
  const host = process.env.DB_HOST || 'localhost';
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASSWORD || '';
  const port = Number(process.env.DB_PORT) || 3306;
  const dbName = process.env.DB_NAME || 'student_management';

  try {
    console.log(`Connecting to MySQL server at ${host}:${port} as user '${user}'...`);
    const connection = await mysql.createConnection({
      host,
      user,
      password,
      port,
      multipleStatements: true
    });

    console.log('Connected! Executing schema script...');
    const schemaPath = path.join(__dirname, '..', 'schema.sql');
    const sql = fs.readFileSync(schemaPath, 'utf8');

    await connection.query(sql);
    console.log(`Successfully created/verified database '${dbName}' and populated tables.`);
    
    await connection.end();
    console.log('Database initialization complete! You can now start the application.');
    process.exit(0);
  } catch (err) {
    console.error('Database Initialization Failed:');
    console.error(err.message);
    console.error('\nTips:');
    console.error('1. Verify MySQL service is running (e.g. via XAMPP, WAMP, MySQL Workbench, or Windows Services).');
    console.error('2. Check DB_USER and DB_PASSWORD in backend/.env.');
    process.exit(1);
  }
}

initDatabase();
