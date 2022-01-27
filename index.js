const inquirer = require("inquirer");
const mysql = require("mysql2");

const db = mysql.createConnection(
    {
      host: 'localhost',
      // MySQL username,
      user: 'root',
      // MySQL password
      password: '',
      database: 'employee_db',
      port: 3306,
    }
  );

db.connect((err) => {
    if (err) throw err;
    runProgram();
});

function runProgram() {
    inquirer.prompt([{
        name: "choice",
        type: "list",
        message: "What would you like to do?",
        choices: ["View All Employees", "Add Employee", "Update Employee Role", "View All Roles", "Add Role", "View All Departments", "Add Department", "Quit"]
    }]).then((answer) =>{
        // console.log(answer);
         switch (answer.choice) {
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

function displayEmployees() {
  db.query('SELECT employees.id, CONCAT(employees.first_name, " ", employees.last_name) AS name, role.title, department.name as department, role.salary, CONCAT(managers.first_name, " ", managers.last_name) AS manager FROM employee employees LEFT JOIN employee managers ON managers.id = employees.manager_id INNER JOIN role ON (role.id = employees.role_id) INNER JOIN department ON (department.id = role.department_id) ORDER BY employees.id', (err, results) => {
    if (err) throw err;
    console.table(results);
    runProgram();
  });
};

async function addEmployee() {

    db.query('SELECT id, title AS role FROM role ORDER BY id;', (err, roles) => {
        if (err) throw err;
        db.query('SELECT id, CONCAT(first_name, " ", last_name) AS name, manager_id FROM employee ORDER BY id;', (err, managers) => {
            if (err) throw err;
            console.table(managers)
    
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
                    type: "list",
                    message: "Select the employee's role:",
                    choices: function() {
                        let roleArray = [];
                        for (let i = 0; i < roles.length; i++) {
                            roleArray.push(roles[i].role)
                        } return roleArray;
                    },
                },
                {
                    name: "employeeManager",
                    type: "list",
                    message: "Select the employee's manager:",
                    choices: function() {
                        let managerArray = ["NONE"];
                        for (let k = 0; k < managers.length; k++) {
                            managerArray.push(managers[k].name)
                        } return managerArray;
                    },
                }
                ]).then((newEmployee) => {
                    let role_id;
                    let manager_id;
                    for (let j = 0; j < roles.length; j++) {
                        // console.log(newEmployee.employeeRole);
                        // console.log(roles[j].role);
                        // console.log(roles[j].id);
                     if (roles[j].role == newEmployee.employeeRole) {
                        role_id = roles[j].id
                     }
                    }
                    for (let f = 0; f < managers.length; f++) {
                        // console.log(newEmployee.employeeManager);
                        console.log(managers[f].name);
                        // console.log(roles[f].id);
                     if (managers[f].name == newEmployee.employeeManager) {
                        manager_id = managers[f].id
                     }
                    }
                    if (newEmployee.employeeManager == 'NONE') {
                        manager_id = null
                    }
                    // console.log(role_id);
                    // console.log(manager_id);
                    // console.log(newEmployee.firstName);
                    // console.log(newEmployee.lastName);
                    db.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);', [
                        newEmployee.firstName,
                        newEmployee.lastName,
                        role_id,
                        manager_id
                    ]),
                        console.log(`${newEmployee.firstName} has been successfully added.`);
                        runProgram(); 
            })
        })
    })
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

function displayRoles() {
    db.query('SELECT role.id, role.title, role.salary, department.name FROM role INNER JOIN department ON (role.department_id = department.id) ORDER BY role.id;', (err, results) => {
      if (err) throw err;
      console.table(results);
      runProgram();
    });
};


function addRole() {
    db.query('SELECT id, name AS department FROM department ORDER BY id;', (err, departments) => {
        if (err) throw err;

        inquirer.prompt([
                { 
                    name: "roleTitle",
                    type: "input",
                    message: "Enter the new role's name:"
                },
                { 
                    name: "roleSalary",
                    type: "input",
                    message: "Enter the role's salary amount:"
                },
                { 
                    name: "roleDept",
                    type: "list",
                    message: "Please select the department this role belongs to:",
                    choices: function() {
                        let deptArray = [];
                        for (let i = 0; i < departments.length; i++) {
                            deptArray.push(departments[i].department)
                        } return deptArray;
                    },
                }
            ]).then((newRole) => {
                let dept_id;
                for (let j = 0; j < departments.length; j++) {
                    // console.log(newRole.roleDept);
                    // console.log(departments[j].department);
                    // console.log(departments[j].id);
                 if (departments[j].department == newRole.roleDept) {
                    dept_id = departments[j].id
                 }
                }
                console.log(dept_id);
                console.log(newRole.roleTitle);
                console.log(newRole.roleSalary);
                db.query('INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?);', [
                    newRole.roleTitle,
                    newRole.roleSalary,
                    dept_id
                ]),
                    console.log(`${newRole.roleTitle} has been successfully added.`);
                    runProgram(); 
            })
    })
};

function displayDepartments() {
    db.query('SELECT id, name AS department FROM department ORDER BY id;', (err, results) => {
      if (err) throw err;
      console.table(results);
      runProgram();
    });
};

function addDepartment() {
 inquirer.prompt([
          { 
              name: "departmentName",
              type: "input",
              message: "Enter the new department's name:"
          }
      ]).then((newDept) => {
          db.query("INSERT INTO department(name) VALUES (?);", [
              newDept.departmentName,
          ])
          console.log(`${newDept.departmentName} has been successfully added.`);
          runProgram();  
      })      
};