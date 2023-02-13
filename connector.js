const { dbhost, dbname, dbuser, dbpass } = require('./config.json');

module.exports = class Connector {
    static startConnection() {
        var mysql = require('mysql');
        var conn = mysql.createConnection({
            host: dbhost,
            database: dbname,
            user: dbuser,
            password: dbpass,
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