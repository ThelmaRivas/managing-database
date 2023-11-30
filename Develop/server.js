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
};

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
};

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
};

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
};

// Add department function
function addDepartment() {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'name',
                message: 'What is the name of the department?',
            },
        ])
        .then((answers) => {
            const query = 'INSERT INTO department (name) VALUES (?)';
            connection.query(query, [answers.name], (err) => {
                if (err) {
                    console.error('Error adding department:', err);
                    mainMenu();
                    return;
                }
                console.log(`Department "${answers.name}" added successfully to the database!`);
                mainMenu();
            });
        });
};

// Add role function
function addRole() {
    // Query the database to get the existing departments
    const departmentQuery = 'SELECT * FROM department';
    connection.query(departmentQuery, (err, departments) => {
        if (err) {
            console.error('Error retrieving departments:', err);
            mainMenu();
            return;
        }

        const departmentChoices = departments.map((department) => ({
            name: department.name,
            value: department.id,
        }));

        inquirer
            .prompt([
                {
                    type: 'input',
                    name: 'title',
                    message: 'Enter the title of the role:',
                },
                {
                    type: 'input',
                    name: 'salary',
                    message: 'Enter the salary of the role:',
                },
                {
                    type: 'list',
                    name: 'department_id',
                    message: 'Which department does the role belong to:',
                    choices: departmentChoices,
                },
            ])
            .then((answers) => {
                const query = 'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)';
                connection.query(query, [answers.title, answers.salary, answers.department_id], (err) => {
                    if (err) {
                        console.error('Error adding role:', err);
                        mainMenu();
                        return;
                    }
                    console.log(`Added "${answers.title}" to the database!`);
                    mainMenu();
                })
            });
    });
};

// Add employee function
function addEmployee() {
    // Retrieve the list of roles
    const roleQuery = 'SELECT id, title FROM role';
    connection.query(roleQuery, (err, roles) => {
        if (err) {
            console.error('Error retrieving roles:', err);
            mainMenu();
            return;
        }

        // Retrieve the list of managers
        const managerQuery = 'SELECT id, CONCAT(first_name, " ", last_name) AS manager_name FROM employee';
        connection.query(managerQuery, (err, managers) => {
            if (err) {
                console.error('Error retrieving managers:', err);
                mainMenu();
                return;
            }

            inquirer
                .prompt([
                    {
                        type: 'input',
                        name: 'first_name',
                        message: 'Enter the first name of the employee:',
                    },
                    {
                        type: 'input',
                        name: 'last_name',
                        message: 'Enter the last name of the employee:',
                    },
                    {
                        type: 'list',
                        name: 'role_id',
                        message: 'Select the role of the employee:',
                        choices: roles.map((role) => ({
                            name: role.title,
                            value: role.id,
                        })),
                    },
                    {
                        type: 'list',
                        name: 'manager_id',
                        message: 'Select the manager of the employee:',
                        choices: [{ name: 'None', value: null }, ...managers.map((manager) => ({
                            name: manager.manager_name,
                            value: manager.id,
                        }))],
                    }
                ])
                .then((answers) => {
                    const query = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';
                    connection.query(query, [answers.first_name, answers.last_name, answers.role_id, answers.manager_id], (err) => {
                        if (err) {
                            console.error('Error adding employee:', err);
                            mainMenu();
                            return;
                        }
                        console.log(`Added "${answers.first_name} ${answers.last_name}" to the database!`);
                        mainMenu();
                    });
                });
        });
    });
};

