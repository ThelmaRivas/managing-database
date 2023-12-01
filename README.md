# Employee Database Management CLI

This command-line application allows users to manage a company's employee database by performing various CRUD operations. It provides a content management system (CMS) interface for viewing, adding, and updating departments, roles, and employees.

## Table of Contents

- [Installation](#installation)
- [Features](#features)
- [Usage](#usage)
- [License](#license)
- [Contributing](#contributing)
- [Tests](#tests)
- [Questions](#questions)

## Features
- View all departments: Display a formatted table showing department names and department IDs.
- View all roles: Display a formatted table showing job titles, roles, associated departments, and salaries.
- View all employees: Display a formatted table showing employee IDs, first names, last names, job titles, departments, salaries, and managers.
- Add a department: Prompt the user to enter the name of the department, and add it to the database.
- Add a role: Prompt the user to enter the name, salary, and department for the role, and add it to the database.
- Add an employee: Prompt the user to enter the employee's first name, last name, role, and manager, and add the employee to the database.
- Update an employee role: Prompt the user to select an employee to update, choose a new role for the employee, and update the information in the database.
- Update an employee manager: Prompt the user to select the employee to update, choose its new manager and update the database.
- Filter employees by Manager: Prompt the user to select a manager and displays all the employees that manager has in charge.
- Filter employees by Department: Prompt the user to select a department and displays all the employees working in that department.
- Calculate Department Budget: Calculate the total budget by department. 

## Installation

1. Clone the repository
2. Navigate to the project folder:
3. Install the dependencies: npm install

## Usage

1. Set up your MySQL database connection by updating the connection details in the server.js file.
2. Run the application: node server.js
3. Choose from the presented options to view, add and/or update roles and employees in the database.

Here is a [Walkthrough video](https://drive.google.com/file/d/1dTD3J9qYbMOM8Qy8jgPvZ9ncCYtnc2mS/view)

## License

This project is licensed under the MIT license.

## Contributing

Contributions are welcome, you can contact me via thelma.rivas00@gmail.com for any suggestions or improvements. 

