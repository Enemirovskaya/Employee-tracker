
const inquirer = require("inquirer");
const mysql = require("mysql2");
require("console.table")



const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password:"Dta509336",
    database: "employee_db"
});

connection.connect(function(err){
    if(err) throw err;
    console.log("Mysql is connecred");
    prompting();
});

//Funcrion to prompt user for actions
function prompting(){
    inquirer.prompt([
        {
            type: "list",
            name: "choice",
            message: "What would you like to do?",
            choices: ["View Departments", 
                      "View Roles", 
                      "View Employees",
                      "Add a Department",
                      "Add a Role",
                      "Add an Employee",
                      "Update an Employee role", 
                       ]
        }
    ]).then (function(res){
        switch(res.choice){
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
            default:
                console.log("defoult");
        }
    });
}

    //View All Departments function viewDep()
    function viewDep(){
        connection.query("SELECT * FROM department", function(err,res){
            if(err)throw err;
        console.table(res)
        prompting()
    })
}

    //Vew All Roles function viewRole
    function viewRole(){
        connection.query("SELECT * FROM role", function(err,res){
            if(err)throw err;
        console.table(res)
        prompting()
    })
    }

    //Vew All Employee function viewEmployee
    function viewEmployees(){
        connection.query("SELECT * FROM employee", function(err,res){
            if(err)throw err;
        console.table(res)
        prompting()
    })
    }

    //Add new employee function addEmp
    function addDep(){
        inquirer.prompt([
            {
            name: "department",
            type: "input",
            message: "What department would you like to add?"
            }
        ]).then(function(answer){
            connection.query ("INSERT INTO department VALUES (DEFAULT, ?)"
            [answer.department], 
            function(err){
                if(err) throw err;
                console.table(res)
                prompting();
            })
        })
    }
    //Add new role function addRole
    function addRole(){
        inquirer.prompt([
            {
            name: "role",
            type: "input",
            message: "What role would you like to Enter?"
            },
            {
                name:"salary",
                type:"number",
             message:"Enter salary for this role.",
             validate: function(value){
                if (isNaN(value) === false){
                    return true;
                }return false;
            }},
            {
                name:"department_id",
                type:"number",
             message:"Enter department id.",
             validate: function(value){
                if (isNaN(value) === false){
                    return true;
                }return false;
            }} 
        ]).then(function(answer){
            connection.query("INSERT INTO role SET ?",
            {
                title: answer.role,
                salary: answer.salary,
                department_id: answer.department_id
            },
            function(err){
                if(err) throw err;
                prompting();
            })
        })
    }
    //Add new Employee function addEmp
    function addEmp(){
        connection.query("SELECT * FROM role", function(err, results){
            if (err) throw err;
            inquirer.prompt([
                {
                    name: "firstName",
                    type: "input",
                    message: "Enter employee's first name."
                },
                {
                    name: "lastName",
                    type: "input",
                    message: "Enter employee's last name."
                },
                {
                    name: "roleId",
                    type: "rawlist",
                    choices:  function(){
                     let choiceArray = [];
                    for(i = 0; i < results.length; i++){
                    choiceArray.push(results[i].title);
                    }
                        return choiceArray;
                    },
                    message: "Select Title" 
                },
                {
                    name:"managerId",
                    type:"number",
                 validate: function(value){
                    if (isNaN(value) === false){
                        return true;
                    }return false;

                }, 
                message:"Enter manager's ID.",
                default: "1"
                }
            ]).then(function(answer){
                connection.query("INSERT INTO employee SET ?",
                {
                    first_name: answer.firstName,
                    last_name: answer.lastName,
                    rile_id: answer.roleId,
                    manager_id: answer.managerId
                })
                prompting()
            });
        });
    }
    //Update Employee function updateEmpRole
    function updateEmpRole(){
        connection.query("SELECT * FROM employee",
            function(err, results){
            if(err) throw err;
            inquirer.prompt([
                {
                    name: "choice",
                    type: "rawlist",
                    choices: function(){
                        let choiceArray = [];
                        for(i = 0; i < results.length; i++)
                        {
                            choiceArray.push(results[i].last_name);
                        }
                        return choiceArray;
                    },
                    message: "Which employee would you like to update?"
                }
            ]).then(function(answer){
                const updatedEmp = answer.choice;

                connection.query("SELECT * FROM employee",
                function(err,results){
                    if(err) throw err;
                    inquirer.prompt([
                        {
                        name: "role",
                        type: "rawlist",
                        choices: function(){
                            const choiceArray = [];
                            for(i = 0; i < results.length; i++)
                            {
                                choiceArray.push(results[i].role_id);
                            }
                            return choiceArray;
                            },
                        message: "Choose title."
                        },
                        {
                            name: "manager",
                            type: "number",
                            validate: function(value){
                                if(isNaN)(value)=== false){
                                    return true;
                                }
                                return false;
                            },
                            message: "Enter new manager ID",
                            default: "1"
                        }
                    ]).then
                })
            })
        })
    }