const inquirer = require("inquirer");
const mysql = require("mysql2");
const { exit } = require("process");
require("console.table");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Dta509336",
  database: "employee_db",
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("Mysql is connected");
  prompting();
});

//Funcrion to prompt user for actions
function prompting() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "choice",
        message: "What would you like to do?",
        choices: [
          "View Departments",
          "View Roles",
          "View Employees",
          "Add a Department",
          "Add a Role",
          "Add an Employee",
          "Update an Employee role",
          "Exit",
        ],
      },
    ])
    .then(function (res) {
      switch (res.choice) {
        case "View Departments":
          viewDep();
          break;
        case "View Roles":
          viewRole();
          break;
        case "View Employees":
          viewEmployees();
          break;
        case "Add a Department":
          addDep();
          break;
        case "Add a Role":
          addRole();
          break;
        case "Add an Employee":
          addEmp();
          break;
        case "Update an Employee role":
          updateEmpRole();
          break;
        case "Exit":
          exit();
          break;
        default:
          console.log("defoult");
      }
    });
}

//View All Departments function viewDep()
function viewDep() {
 
  connection.query("SELECT * FROM department", function (err, results) {
    if (err) throw err;
    console.table(results);
    prompting();
  });
}

//Vew All Roles function viewRole
function viewRole() {                   
  connection.query("SELECT * FROM role", function (err, results) {
    if (err) throw err;
    
   
    console.table(results);
    prompting();
  });
  
}

//Vew All Employee function viewEmployee
function viewEmployees() {
  const query = `SELECT e.id AS ID, 
                    e.first_name AS First, 
                    e.last_name AS Last, 
                    e.role_id As Role, 
                    r.salary AS Salary,
                    m.last_name AS Manager, 
                    d.name AS Department 
                    FROM employee e 
                    LEFT JOIN employee m ON e.manager_id = m.id 
                    LEFT JOIN role r ON e.role_id = r.title 
                    LEFT JOIN department d 
                    ON r.department_id = d.id`;
  connection.query(query, function (err, results) {
    if (err) throw err;
    console.table(results);
    prompting();
  });
}

//Add new employee function addEmp
function addDep() {
  inquirer
    .prompt([
      {
        name: "department",
        type: "input",
        message: "What department would you like to add?",
      },
    ])
    .then(function (answer) {
      connection.query(
        `INSERT INTO department (name) VALUES ('${answer.department}')`,
        function (err, results) {
          if (err) {
            console.error(err.message);
            throw err;
          }
          console.table(results);
          prompting();
        }
      );
    });
}
//Add new role function addRole
function addRole() {
  inquirer
    .prompt([
      {
        name: "role",
        type: "input",
        message: "What role would you like to Enter?",
      },
      {
        name: "salary",
        type: "number",
        message: "Enter salary for this role.",
        validate: function (value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        },
      },
      {
        name: "department_id",
        type: "number",
        message: "Enter department id.",
        validate: function (value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        },
      },
    ])
    .then(function (answer) {
      connection.query(
        "INSERT INTO role SET ?",
        {
          title: answer.role,
          salary: answer.salary,
          department_id: answer.department_id,
        },
        function (err) {
          if (err) throw err;
          prompting();
        }
      );
    });
}
//Add new Employee function addEmp
function addEmp() {
    inquirer.prompt([
        {
          name: "firstName",
          type: "input",
          message: "Enter employee's first name.",
        },
        {
          name: "lastName",
          type: "input",
          message: "Enter employee's last name.",
        },
        {
          name: "roleId",
          type: "number",
          validate: function (value) {
            if (isNaN(value) === false) {
              return true;
            }
            return false;
          },
          message: "Enter new role ID?"
        },
        {
          name: "managerId",
          type: "number",
          validate: function (value) {
            if (isNaN(value) === false) {
              return true;
            }
            return false;
          },
          message: "Enter manager's ID.",
          default: "1",
        },
      ]).then(function (answer) {
        connection.query("INSERT INTO employee SET ?",
        {
          first_name: answer.firstName,
          last_name: answer.lastName,
          role_id: answer.roleId,
          manager_id: answer.managerId,
        });
        console.table(answer);
        prompting();
      });
  };
// Update Employee function updateEmpRole
function updateEmpRole() {
        connection.promise().query("SELECT * FROM employee;")
        .then(([rows])=>{
          let employees = rows
          const choiceArray=employees.map(({id, first_name, last_name})=>
          ({
            name:`${first_name} ${last_name}`,
            value:id
          }))
          inquirer
          .prompt([
            {
              name: "employeeId",
              type: "list",
              choices: choiceArray,
              message: "Select the employee to update",
            },
            
          ])
          .then(function (answer) {
            let employeeId = answer.employeeId;
            connection.promise().query("SELECT role.id, role.title, department.name as department, role.salary FROM role LEFT JOIN department ON role.department_id=department.id;")
            .then(([rows])=>{
              let roles =rows;
              const roleChoices = roles.map(({id, title})=>({
                name:title,
                value:id
              }))
              inquirer.prompt([
                {
                  type:"list",
                  name:"roleId",
                  message: "Which role would you like to assign the employee ",
                  choices: roleChoices
                }
              ])
              .then(res=>{
                connection.promise().query("UPDATE employee SET role_id = ? WHERE id = ?", res.roleId, employeeId)
              })
              .then(()=>console.log("UPDATED employee role"))
              .then(()=>prompting())
            })
             
          });
        })
      
  };
// {
// name: "id",
// type: "number",
// message: "What is employee ID of the person ?"
// },
// {
// name: "firstName",
// type: "input",
// message: "Enter new first name or press enter?"
// },
// {
// name: "lastName",
// type: "input",
// message: "Enter new last name or press enter?"
// },
// {
// name: "newRole",
// type: "number",
// message: "Enter new role ID?"
// }

//     {firstName, lastName, newRole, id}){
//     if(firstName || lastName || newRole){
//   connection.query(`UPDATE employee SET ${firstName ? 'first_name ='+ firstName + ",": ''}${ lastName ? 'last_name='+lastName + ",": ''}
//   ${ newRole ? 'role_id ='+ newRole: ''} WHERE id=${id}`),
//     function(err){

//         console.log(working);
//             if(err) throw err;
//              console.table(res);
//      } }
// connection.query ("INSERT INTO department VALUES (DEFAULT, ?)"
// [answer.department],
// function(err){
//     if(err) throw err;
//     console.table(res)
//     prompting();
//

// connection.query("SELECT * FROM employee",
//     function(err, results){
//     if(err) throw err;
//     inquirer.prompt([
//         {
//             name: "choice",
//             type: "rawlist",
//             choices: function(){
//                 let choiceArray = [];
//                 for(i = 0; i < results.length; i++)
//                 {
//                     choiceArray.push(results[i].last_name);
//                 }
//                 return choiceArray;
//             },
//             message: "Which employee would you like to update?"
//         }
//     ]).then(function(answer){
//         const updatedEmp = answer.choice;

//         connection.query("SELECT * FROM employee",
//         function(err,results){
//             if(err) throw err;
//             inquirer.prompt([
//                 {
//                 name: "role",
//                 type: "rawlist",
//                 choices: function(){
//                     const choiceArray = [];
//                     for(i = 0; i < results.length; i++)
//                     {
//                         choiceArray.push(results[i].role_id);
//                     }
//                     return choiceArray;
//                     },
//                 message: "Choose title."
//                 },
//                 {
//                     name: "manager",
//                     type: "number",
//                     validate: function(value){
//                         if(isNaN(value)=== false){
//                             return true;
//                         }
//                         return false;
//                     },
//                     message: "Enter new manager ID",
//                     default: "1"
//                 }
//             ]).then
//         })
//     })
// })
