// const mysql = require('mysql2/promise');

// const pool = mysql.createPool({
//     host: 'localhost',
//     user: 'root',
//     password: '',
//     database: 'mydb',
//     waitForConnections: true,
//     connectionLimit: 10,
//     queueLimit: 0
// })

// module.exports = pool;

const { Sequelize } = require("sequelize");

// const sequelize = new Sequelize("mydb", "root", "root", {
const sequelize = new Sequelize("mydb", "root", "root", {
    host: "localhost",
    dialect: "mysql", // Use 'mysql' for MySQL databases
    // logging: false, // Disable SQL query logging in console
    logging: (...msg) => console.log(msg),
});

module.exports = sequelize;
