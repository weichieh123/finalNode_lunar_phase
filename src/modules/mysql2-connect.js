const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'lunar_phase',
    waitForConnections: true,
    connectionLimit: 10, // 最大連線數
    queueLimit: 0
});

module.exports = pool.promise();