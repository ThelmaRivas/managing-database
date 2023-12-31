//Import required modules/packages
const mysql = require("mysql2");
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


// MAIN MENU FUNCTIONS AND INQUIRER PROMPTS

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
                    'View total utilized budget by department',
                    'Exit',
                ],
            },
        ])
        .then(handleChoice);
};

// Function to handle user choice
function handleChoice(answers) {
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
        case 'View total utilized budget by department':
            calculateDepartmentBudget();
            break;
        case 'Exit':
            console.log('Exiting...');
            connection.end();
            break;
    }
};

// View all departments function
function viewAllDepartments() {
    connection.query('SELECT id, name FROM department', (err, results) => {
        if (err) {
            console.error('Error retrieving departments:', err);
            return mainMenu();
        }
        console.table(results);
        return mainMenu();
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

// Update employee role function
function updateEmployeeRole() {
    // Retrieve the list of employees
    const employeeQuery = 'SELECT id, CONCAT(first_name, " ", last_name) AS employee_name FROM employee';
    connection.query(employeeQuery, (err, employees) => {
        if (err) {
            console.error('Error retrieving employees:', err);
            mainMenu();
            return;
        }

        // Retrieve the list of roles
        const roleQuery = 'SELECT id, title FROM role';
        connection.query(roleQuery, (err, roles) => {
            if (err) {
                console.error('Error retrieving roles:', err);
                mainMenu();
                return;
            }

            inquirer
                .prompt([
                    {
                        type: 'list',
                        name: 'id',
                        message: 'Select the employee to update:',
                        choices: employees.map((employee) => ({
                            name: employee.employee_name,
                            value: employee.id,
                        })),
                    },
                    {
                        type: 'list',
                        name: 'role_id',
                        message: 'Select the new role of the employee:',
                        choices: roles.map((role) => ({
                            name: role.title,
                            value: role.id,
                        })),
                    },
                ])
                .then((answers) => {
                    const query = 'UPDATE employee SET role_id = ? WHERE id = ?';
                    connection.query(query, [answers.role_id, answers.id], (err) => {
                        if (err) {
                            console.error('Error updating employee role:', err);
                            mainMenu();
                            return;
                        }
                        console.log('Employee role updated successfully!');
                        mainMenu();
                    });
                });
        });
    });
};


// BONUS FUNCTIONS 

// Update an employee's manager function
function updateEmployeeManager() {
    // Retrieve the list of employees
    const employeeQuery = 'SELECT id, CONCAT(first_name, " ", last_name) AS employee_name FROM employee';
    connection.query(employeeQuery, (err, employees) => {
        if (err) {
            console.error('Error retrieving employees:', err);
            mainMenu();
            return;
        }
        
        inquirer
            .prompt([
                {
                    type: 'list',
                    name: 'id',
                    message: 'Select the employee to update:',
                    choices: employees.map((employee) => ({
                        name: employee.employee_name,
                        value: employee.id,
                    })),
                },
                {
                    type: 'list',
                    name: 'manager_id',
                    message: "Select the employee's new manager:",
                    choices: employees.map((employee) => ({
                        name: employee.employee_name,
                        value: employee.id,
                    })),
                },
            ])
            .then((answers) => {
                const query = 'UPDATE employee SET manager_id = ? WHERE id = ?';
                connection.query(query, [answers.manager_id, answers.id], (err) => {
                    if (err) {
                        console.error('Error updating employee manager:', err);
                        mainMenu();
                        return;
                    }
                    console.log('Employee manager updated successfully!');
                    mainMenu();
                });
            });
    });
};

// View employees by manager function
function viewEmployeesByManager() {
    // Retrieve the list of managers
    const managerQuery = 'SELECT id, CONCAT(first_name, " ", last_name) AS manager_name FROM employee WHERE manager_id IS NULL';
    connection.query(managerQuery, (err, managers) => {
        if (err) {
            console.error('Error retrieving managers:', err);
            mainMenu();
            return;
        }
        
        inquirer
            .prompt([
                {
                    type: 'list',
                    name: 'manager_id',
                    message: 'Select the manager:',
                    choices: managers.map((manager) => ({
                        name: manager.manager_name,
                        value: manager.id,
                    })),
                }
            ])
            .then((answers) => {
                const query = 'SELECT id, CONCAT(first_name, " ", last_name) AS employee_name FROM employee WHERE manager_id = ?';
                connection.query(query, [answers.manager_id], (err, employees) => {
                    if (err) {
                        console.error('Error retrieving employees:', err);
                        mainMenu();
                        return;
                    }
                    console.log('Employees by Manager:');
                    employees.forEach((employee) => {
                        console.log(`${employee.id}: ${employee.employee_name}`);
                    });
                    mainMenu();
                });
            });
    });
};

// View employees by department function
function viewEmployeesByDepartment() {
    // Retrieve the list of departments
    const departmentQuery = 'SELECT id, name FROM department';
    connection.query(departmentQuery, (err, departments) => {
        if (err) {
            console.error('Error retrieving departments:', err);
            mainMenu();
            return;
        }
        
        inquirer
            .prompt([
                {
                    type: 'list',
                    name: 'department_id',
                    message: 'Select the department:',
                    choices: departments.map((department) => ({
                        name: department.name,
                        value: department.id,
                    })),
                }
            ])
            .then((answers) => {
                const query = `
                    SELECT employee.id, CONCAT(employee.first_name, " ", employee.last_name) AS employee_name
                    FROM employee
                    INNER JOIN role ON employee.role_id = role.id
                    INNER JOIN department ON role.department_id = department.id
                    WHERE department.id = ?
                `;
                connection.query(query, [answers.department_id], (err, employees) => {
                    if (err) {
                        console.error('Error retrieving employees:', err);
                        mainMenu();
                        return;
                    }
                    console.log('Employees by Department:');
                    employees.forEach((employee) => {
                        console.log(`${employee.id}: ${employee.employee_name}`);
                    });
                    mainMenu();
                });
            });
    });
};

// Calculate the total utilized budget of a department function
function calculateDepartmentBudget() {
    // Retrieve the list of departments
    const departmentQuery = 'SELECT id, name FROM department';
    connection.query(departmentQuery, (err, departments) => {
        if (err) {
            console.error('Error retrieving departments:', err);
            mainMenu();
            return;
        }
        
        inquirer
            .prompt([
                {
                    type: 'list',
                    name: 'department_id',
                    message: 'Select the department:',
                    choices: departments.map((department) => ({
                        name: department.name,
                        value: department.id,
                    })),
                }
            ])
            .then((answers) => {
                const query = `
                    SELECT SUM(role.salary) AS total_budget
                    FROM employee
                    INNER JOIN role ON employee.role_id = role.id
                    INNER JOIN department ON role.department_id = department.id
                    WHERE department.id = ?
                `;
                connection.query(query, [answers.department_id], (err, results) => {
                    if (err) {
                        console.error('Error calculating department budget:', err);
                        mainMenu();
                        return;
                    }
                    const totalBudget = results[0].total_budget;
                    console.log(`Total Utilized Budget of the Department: $${totalBudget}`);
                    mainMenu();
                });
            });
    });
};