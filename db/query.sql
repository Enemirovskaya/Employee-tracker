SELECT 
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

    LEFT JOIN department d ON r.department_id = d.id 
