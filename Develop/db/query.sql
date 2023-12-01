-- View all departments 
SELECT id, name 
FROM department;

-- View all roles
SELECT r.id, r.title, r.salary, d.name AS department
FROM role AS r
INNER JOIN department AS d ON r.department_id = d.id;

-- View all employees
SELECT e.id, e.first_name, e.last_name, r.title AS job_title, d.name AS department,
  r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
FROM employee AS e
INNER JOIN role AS r ON e.role_id = r.id
INNER JOIN department AS d ON r.department_id = d.id
LEFT JOIN employee AS m ON e.manager_id = m.id;

-- Add a department
INSERT INTO department (name) 
VALUES (?);

-- Add a role
INSERT INTO role (title, salary, department_id) 
VALUES (?, ?, ?);

-- Add an employee
INSERT INTO employee (first_name, last_name, role_id, manager_id) 
VALUES (?, ?, ?, ?);

-- Update an employee's role
UPDATE employee 
SET role_id = ? 
WHERE id = ?;


