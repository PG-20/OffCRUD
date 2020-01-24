const mysql = require('mysql');
const fs = require('fs');
const json = require('json');
const path = require('path');
const config_param = fs.readFileSync(path.resolve(__dirname, './db_config.json'), 'utf-8');
const config_param_json = JSON.parse(config_param);

const pool = mysql.createPool({
    host: config_param_json.mysql.host,
    port: config_param_json.mysql.port,
    acquireTimeout: config_param_json.mysql.acquireTimeout,
    user: config_param_json.mysql.user,
    password: config_param_json.mysql.password,
    dateStrings: true
});

let query = async (sql, values) => {
    return new Promise((resolve, reject) => {
        pool.getConnection(function (err, connection) {
            if (err) {
                reject(err);
            } else {
                connection.query(sql, values, (err, rows) => {
                    if (err) {
                        console.log(`ERR: ${err}`);
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                    connection.release();
                });
            }
        });
    });
};

module.exports = {query};
