const mysql = require('mysql')
const config = require('./dbConfig.js')

const connection = mysql.createConnection({
  user: config.user,
  password: config.password,
  host: config.host,
  port: config.port,
  database: config.database
});

connection.connect((err) => {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
  console.log(`connected as id ${connection.threadId}`);
});

module.exports = connection;