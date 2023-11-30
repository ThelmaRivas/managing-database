//Import required modules/packages
const mysql = require("mysql");
const inquirer = require("inquirer");

//Create connection to database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '@fanySQL1207.,',
    database: 'management_db',
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database!');
    mainMenu();
});