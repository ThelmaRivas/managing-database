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


// Main menu functions and inquirer prompts

// Function for main menu
function mainMenu() {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'choice',
                message: 'What would you like to do?',
                choices: [
                    'View all departments',
                    'View all roles',
                    'View all employees',
                    'Add a department',
                    'Add a role',
                    'Add an employee',
                    'Update an employee role',
                    'Update an employee manager',
                    'View employees by manager',
                    'View employees by department',
                    'Delete a department',
                    'Delete a role',
                    'Delete an employee',
                    'View total utilized budget by department',
                    'Exit',
                ],
            },
        ])
        .then((answers) => {
            switch (answers.choice) {
                case 'View all departments':
                    viewAllDepartments();
                    break;
                case 'View all roles':
                    viewAllRoles();
                    break;
                case 'View all employees':
                    viewAllEmployees();
                    break;
                case 'Add a department':
                    addDepartment();
                    break;
                case 'Add a role':
                    addRole();
                    break;
                case 'Add an employee':
                    addEmployee();
                    break;
                case 'Update an employee role':
                    updateEmployeeRole();
                    break;
                case 'Update an employee manager':
                    updateEmployeeManager();
                    break;
                case 'View employees by manager':
                    viewEmployeesByManager();
                    break;
                case 'View employees by department':
                    viewEmployeesByDepartment();
                    break;
                case 'Delete a department':
                    deleteDepartment();
                    break;
                case 'Delete a role':
                    deleteRole();
                    break;
                case 'Delete an employee':
                    deleteEmployee();
                    break;
                case 'View total utilized budget by department':
                    calculateDepartmentBudget();
                    break;
                case 'Exit':
                    console.log('Exiting...');
                    connection.end();
                    break;
            }
        });
}

// View all departments function
function viewAllDepartments() {
    connection.query('SELECT id, name FROM department', (err, results) => {
        if (err) {
            console.error('Error retrieving departments:', err);
            mainMenu();
            return;
        }
        console.table(results);
        mainMenu();
    });
}

// View all roles function
function viewAllRoles() {
    const query = `
    SELECT r.id, r.title, r.salary, d.name AS department
    FROM role AS r
    INNER JOIN department AS d ON r.department_id = d.id
  `;
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error retrieving roles:', err);
            mainMenu();
            return;
        }
        console.table(results);
        mainMenu();
    });
}

// View all employees function
function viewAllEmployees() {
    const query = `
    SELECT e.id, e.first_name, e.last_name, r.title AS job_title, d.name AS department,
      r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
    FROM employee AS e
    INNER JOIN role AS r ON e.role_id = r.id
    INNER JOIN department AS d ON r.department_id = d.id
    LEFT JOIN employee AS m ON e.manager_id = m.id
  `;
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error retrieving employees:', err);
            mainMenu();
            return;
        }
        console.table(results);
        mainMenu();
    });
}