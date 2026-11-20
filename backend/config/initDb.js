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
    const isCloud = host !== 'localhost' && host !== '127.0.0.1';
    const effectiveDb = isCloud ? (process.env.DB_NAME || 'defaultdb') : dbName;
    console.log(`Connecting to MySQL server at ${host}:${port} as user '${user}'...`);

    const connConfig = {
      host,
      user,
      password,
      port,
      multipleStatements: true
    };

    if (isCloud || process.env.DB_SSL === 'true') {
      connConfig.ssl = { rejectUnauthorized: false };
      connConfig.database = effectiveDb;
    }

    const connection = await mysql.createConnection(connConfig);

    console.log('Connected! Executing schema script...');
    const schemaPath = path.join(__dirname, '..', 'schema.sql');
    let sql = fs.readFileSync(schemaPath, 'utf8');

    if (isCloud) {
      // In cloud, replace USE `student_management` with USE `defaultdb` or current DB
      sql = sql.replace(/CREATE DATABASE[^\n]*;/gi, '')
               .replace(/USE `student_management`;/gi, `USE \`${effectiveDb}\`;`);
    }

    await connection.query(sql);
    console.log(`Successfully verified database '${effectiveDb}' and populated tables.`);
    
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
