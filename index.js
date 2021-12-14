const inquirer = require("inquirer");
const mysql = require("mysql2/promise");

startProgram();

async function startProgram() {
    const data = await inquirer.prompt([{
        name: "choice",
        type: "list",
        message: "What do you want to do?",
        choices: ["update role, show employees"]


    }])
    console.log(data)
}

async function updateRole() {

    const connection = await mysql.createConnection({host:'localhost', user: 'root', database: 'employee_db'});
  // query database
  const [rows, fields] = await connection.execute("select * from employee;");

  console.table(rows);
}