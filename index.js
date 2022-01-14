const inquirer = require("inquirer");
const mysql = require("mysql2/promise");
const express = require('express');

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const db = mysql.createConnection(
    {
      host: 'localhost',
      // MySQL username,
      user: 'root',
      // MySQL password
      password: '',
      database: 'employee_db'
    },
  );


runProgram();

async function runProgram() {
    inquirer.prompt({
        name: "choice",
        type: "list",
        message: "What would you like to do?",
        choices: ["View All Employees", "Add Employee", "Update Employee Role", "View All Roles", "Add Role", "View All Departments", "Add Department", "Quit"]
    }).then((answer) =>{

         switch (answer) {
        case "View All Employees":
                displayEmployees()
            break;
        case "Add Employee":
                addEmployee()
            break;
        case "Update Employee Role":
                updateEmployeeRole()
            break;
        case "View All Roles":
                displayRoles()
            break;
        case "Add Role":
                addRole()
            break;
        case "View All Departments":
                displayDepartments()
            break;
        case "Add Department":
                addDepartment()
            break;

        default:
            break;
        }    
    })
};

async function displayEmployees() {

    const connection = await mysql.createConnection({host:'localhost', user: 'root', database: 'employee_db'});
  // query database
  const [rows, fields] = await connection.execute("select employee.id, employee.first_name, employee.last_name, role.title, department.name as department, role.salary from employee inner join role on (role.id = employee.role_id) inner join department on (department.id = role.department_id) order by employee.id");

  console.table(rows);
  runProgram();
};

async function addEmployee() {

    const connection = await mysql.createConnection({host:'localhost', user: 'root', database: 'employee_db'});
  // query database
const managers = await connection.execute("select * from employee;");

const roles = await connection.execute("select * from role;");

    const answers = await inquirer.prompt([
        { 
            name: "firstName",
            type: "input",
            message: "Enter the employee's first name:"
        },
        {
            name: "lastName",
            type: "input",
            message: "Enter the employee's last name:"
        },
        {
            name: "employeeRole",
            type: "list",
            message: "Select the employee's role:",
            choices: roles.map((role) => {
                return {
                    name: role.title,
                    value: role.id
                }
            })
        },
        {
            name: "employeeManager",
            type: "input",
            message: "Select the employee's manager:",
            choices: managers.map((manager) => {
                return {
                    name: manager.first_name + " " + manager.last_name,
                    value: manager.id
                }
            })
        }
    ])
    const newEmployee = await connection.execute("INSERT INTO employee SET ?", {
        first_name: answers.firstName,
        last_name: answers.lastName,
        role_id: answers.employeeRole,
        manager_id: answers.managerID
    });

    console.log(`${answers.firstName} ${answers.lastName} has been successfully added.`);

    // console.log(answers);
    // const firstName = answers.firstName;
    // const lastName = answers.lastName;
    // const roleID = answers.employeeRole;
    // const managerID = answers.employeeManager;
    // const query = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUE (${firstName}, ${lastName}, ${roleID}, ${managerID})`;

    // console.log(query);

    runProgram()
};

async function updateEmployeeRole() {

    const connection = await mysql.createConnection({host:'localhost', user: 'root', database: 'employee_db'});
  // query database
  const [rows, fields] = await connection.execute("select * from employee;");

  let newChoices = rows.map(employee => ({name:employee.name, value:employee}))


  console.table();

  const {choice} = await inquirer.prompt([{
    name: "choice",
    type: "list",
    message: "Which Employee Role would you like to update?",
    choices: newChoices
  }])
  console.log(choice)
  
  runProgram();
};

async function displayRoles() {

    const connection = await mysql.createConnection({host:'localhost', user: 'root', database: 'employee_db'});
  // query database
  const [rows, fields] = await connection.execute("select role.id, role.title, role.salary, department.name from role inner join department on (role.department_id = department.id) order by role.id;");

  console.table(rows);
  runProgram();
};


async function addRole() {

    const connection = await mysql.createConnection({host:'localhost', user: 'root', database: 'employee_db'});
  // query database
  const [rows, fields] = await connection.execute("select * from employee;");

  console.table(rows);
  runProgram();
};

async function displayDepartments() {

    const connection = await mysql.createConnection({host:'localhost', user: 'root', database: 'employee_db'});
  // query database
  const [rows, fields] = await connection.execute("select * from department order by id;");

  console.table(rows);
  runProgram();
};

async function addDepartment() {

    const connection = await mysql.createConnection({host:'localhost', user: 'root', database: 'employee_db'});
  
      const {answers} = await inquirer.prompt([
          { 
              name: "departmentName",
              type: "input",
              message: "Enter the department's name:"
          }
      ])

      const newDepartment = await connection.query("INSERT INTO department SET ?",  {
          name: answers.departmentName,
      });
  
      console.log(`${answers.departmentName} has been successfully added.`);

      runProgram();
};