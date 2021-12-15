const inquirer = require("inquirer");
const mysql = require("mysql2/promise");

runProgram();

async function runProgram() {
    const {choice} = await inquirer.prompt([{
        name: "choice",
        type: "list",
        message: "What would you like to do?",
        choices: ["View All Employees", "Add Employee", "Update Employee Role", "View All Roles", "Add Role", "View All Departments", "Add Department", "Quit"]
    }])
    console.log(choice)

    switch (choice) {
        case "View All Employees":
                displayEmployees()
            break;
        case "Add Employee":
                addEmployee()
            break;
        case "Update Employee Role":
                updateRole()
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


}

async function displayEmployees() {

    const connection = await mysql.createConnection({host:'localhost', user: 'root', database: 'employee_db'});
  // query database
  const [rows, fields] = await connection.execute("select * from employee;");

  console.table(rows);
  runProgram();
}

function addEmployee() {
    inquirer.prompt([
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
            type: "input",
            message: "Enter the employee's role ID:"
        },
        {
            name: "employeeManager",
            type: "input",
            message: "Enter the employee's manager ID:"
        }
    ])
    .then(function(answers){
        console.log(answers);
        const firstName = answers.firstName;
        const lastName = answers.lastName;
        const roleID = answers.employeeRole;
        const managerID = answers.employeeManager;
        const query = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUE (${firstName}, ${lastName}, ${roleID}, ${managerID})`;


        runProgram()
    })
}



async function displayRoles() {

    const connection = await mysql.createConnection({host:'localhost', user: 'root', database: 'employee_db'});
  // query database
  const [rows, fields] = await connection.execute("select * from role;");

  console.table(rows);
  runProgram();
}



async function updateRole() {

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

}


async function displayDepartments() {

    const connection = await mysql.createConnection({host:'localhost', user: 'root', database: 'employee_db'});
  // query database
  const [rows, fields] = await connection.execute("select * from department;");

  console.table(rows);
  runProgram();
}