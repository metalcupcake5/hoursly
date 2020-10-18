const mysql = require('mysql');
const config = require('./config');

const pool = mysql.createPool({
    host: config.host,
    port: 3306,
    user: config.user,
    password: config.pass,
    database: config.name
});

let sql = {};
sql.query = function (query, params, callback) {
    pool.getConnection(function (err, connection) {
        if (err) {
            if (callback) callback(err, null, null);
            return;
        }

        connection.query(query, params, function (error, results, fields) {
            connection.release(); // always put connection back in pool after last query
            if (error) {
                if (callback) callback(error, null, null);
                return;
            }
            if (callback) callback(false, results, fields);
        });
    });
};

module.exports = sql;