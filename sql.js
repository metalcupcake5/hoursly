const mysql = require('mysql');
const config = require('./config');

const con = mysql.createConnection({
    host: config.host,
    port: 3306,
    user: config.user,
    password: config.pass,
    database: config.name
});

let sql = {};
sql.query = function (query, params, callback) {
    con.getConnection(function (err, connection) {
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
        con.end();
    });
};

module.exports = sql;