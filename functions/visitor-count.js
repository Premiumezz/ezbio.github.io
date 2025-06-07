const mysql = require('mysql2/promise');

exports.handler = async function (event) {
    const connection = await mysql.createConnection({
        host: 'sql8.freesqldatabase.com',
        user: 'sql8783576',
        password: 'By52IGZPka',
        database: 'sql8783576',
        port: 3306
    });

    const ip = event.headers['client-ip'] || 'unknown';

    try {
        await connection.execute('CREATE TABLE IF NOT EXISTS visitors (id INT AUTO_INCREMENT PRIMARY KEY, ip VARCHAR(45) UNIQUE)');
        await connection.execute('INSERT IGNORE INTO visitors (ip) VALUES (?)', [ip]);
        const [rows] = await connection.execute('SELECT COUNT(*) AS count FROM visitors');
        return {
            statusCode: 200,
            body: JSON.stringify({ count: rows[0].count })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Ошибка сервера' })
        };
    } finally {
        await connection.end();
    }
};