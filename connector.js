const DB_HOST = process.env.dbHost;
const DB_NAME = process.env.dbName;
const DB_USER = process.env.dbUser;
const DB_PASS = process.env.dbPass;

module.exports = class Connector {
    static startConnection() {
        var mysql = require('mysql');
        var conn = mysql.createConnection({
            host: DB_HOST,
            database: DB_NAME,
            user: DB_USER,
            password: DB_PASS,
        });

        conn.connect(function (err) {
            if (err) {
                console.error('Connection error: ' + err.stack);
                return;
            }
            console.log('Connected. Connection id: ' + conn.threadId);
        });

        return conn;
    }
}