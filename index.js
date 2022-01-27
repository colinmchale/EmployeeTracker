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
        console.log(answer);
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
  db.query('select employee.id, employee.first_name, employee.last_name, role.title, department.name as department, role.salary from employee inner join role on (role.id = employee.role_id) inner join department on (department.id = role.department_id) order by employee.id', (err, results) => {
    if (err) throw err;
    console.table(results);
    runProgram();
  });
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

function displayRoles() {
    db.query('select role.id, role.title, role.salary, department.name from role inner join department on (role.department_id = department.id) order by role.id;', (err, results) => {
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