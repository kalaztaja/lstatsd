require("dotenv").config();
const sql_commands = require("./sql_commands.js");
var mysql = require("mysql2");

function start_db() {
  var con = mysql.createConnection({
    host: "localhost",
    user: process.env.MY_SQL_USERNAME,
    password: process.env.MY_SQL_PASSWORD,
    database: process.env.MY_SQL_DB,
  });
  con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
  });
  con.query(`DROP TABLE stats`, (err, result) => {
    err ? console.log(err) : console.log(result);
  });
  con.query(`DROP TABLE players`, (err, result) => {
    err ? console.log(err) : console.log(result);
  });
  con.query(sql_commands.createPlayersTable, function (err, result) {
    err ? console.log(err) : console.log(result);
  });
  con.query(sql_commands.createStatsTable, function (err, result) {
    err ? console.log(err) : console.log(result);
  });
  return con;
}

module.exports.start_db = start_db;
