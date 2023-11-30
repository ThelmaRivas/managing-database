-- Seeds file for sample data of management_db database

INSERT INTO department (id, name) VALUES
  (1, 'Sales'),
  (2, 'Marketing'),
  (3, 'Engineering');

  INSERT INTO role (id, title, salary, department_id) VALUES
  (1, 'Sales Manager', 50000, 1),
  (2, 'Sales Representative', 30000, 1),
  (3, 'Marketing Manager', 45000, 2),
  (4, 'Marketing Specialist', 35000, 2),
  (5, 'Software Engineer', 60000, 3),
  (6, 'QA Engineer', 40000, 3);

  INSERT INTO employee (id, first_name, last_name, role_id, manager_id) VALUES
  (1, 'John', 'Doe', 1, null),
  (2, 'Jane', 'Smith', 2, 1),
  (3, 'Michael', 'Johnson', 3, null),
  (4, 'Emily', 'Williams', 4, 3),
  (5, 'David', 'Brown', 5, null),
  (6, 'Sarah', 'Taylor', 6, 5);