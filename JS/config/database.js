// Create connection
const mysql = require('mysql');

module.exports = new mysql.createConnection({
    host: 'localhost',
    user: 'tengosc',
    password: 'reja69',
    database: 'jahl'
});