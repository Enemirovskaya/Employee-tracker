
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
    console.log("Mysql is connected");
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
                      "Exit"
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
            inquirer.prompt([
                {
                    name:"chooseDep",
                    type:"list",
                    choices: function(){
                        let choiceArray = [];
                    for(i=0; i=results.length; i++){
                        choiceArray.push(results[i].name);
                        }
                        return choiceArray;          
                        },
                        message: "Choose the department"
                }
            ]).then(function(answer){
                connection.query(
                 `SELECT
                    e.id AS ID,
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
                    ON r.department_id = d.id
                    WHERE d.name=?`, [answer.chooseDep], function(err, results)
                    {
                        if(err) throw err;
                        console.table(results);
                        prompting()
                    }
                )
            })
       
    })
}

    //Vew All Roles function viewRole
    function viewRole(){
        connection.query("SELECT * FROM role", function(err,results){
            if(err)throw err;
            inquirer.prompt([
                {
                    name:"chooseRole",
                    type:"list",
                    choices: function(){
                        let choiceArray = [];
                    for(i=0; i=results.length; i++){
                        choiceArray.push(results[i].title);
                        }
                        return choiceArray;          
                        },
                        message: "Choose the role"
                    }
                ]).then(function(answer){
                    connection.query(
                        `SELECT
                        e.id AS ID,
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
                        ON r.department_id = d.id
                        WHERE e.role_id=?`, [answer, chooseDep], function(err, results){
                            if(err)throw err;
                            console.table(results);
                            prompting();
                        })
                });
        });
    
    }

    //Vew All Employee function viewEmployee
    function viewEmployees(){
        const query=`SELECT e.id AS ID, 
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
                    ON r.department_id = d.id`
        connection.query(query, function(err,res){
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
                    message: "Choose title" 
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
   // Update Employee function updateEmpRole
    function updateEmpRole(){
        connection.query("SELECT * FROM employee",function(err, results){
            if (err) throw err;
        inquirer.prompt([
            {
                name: "choice",
                type: "list",
                choices: finction(){
                    let choiceArray = [];
                    for(i=0; i < results.length; i++)
                    {
                        choiceArray.push(results[i].last_name);
                    }
                    return choiceArray;
                },
                message: "Select employee to update"
            }
           
        ]).then(function(answer){
            const firstName = answer.choice;

            connection.query("SELECT * FROM employee",function(err, results){
                if (err) throw err;
                inquirer.prompt([
                   {
                    name:"roleId",
                    type: "list",
                    choices: function(){
                        const choiceArray = [];
                        for(i=0; i=<results.length; i++)
                    {
                        choiceArray.push(results[i].role_id);
                    }
                    return choiceArray;
                },
                message: "Select title"
            },
            {
                name: "managerId",
                type: "number",
                validate: function(value){
                    if (isNaN(value) === false){
                        return true;
                    }return false;
                },
                message: "Enter updated manager ID",
                default:"1"
            }     
            ]).then(function(answer){
                connection.query("UPDATE employee SET ? WHERE last_name = ?",
                [
                    {
                        role_id: answer.role,
                        manager_id: answer.manager
                    }, firstName
                ],
            ),
                prompting();
            });
        })
    })
})
} // {
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
    