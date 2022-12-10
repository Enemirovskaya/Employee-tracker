INSERT INTO department (name)
VALUES("HR"),
      ("Finance"),
      ("Sales"),
      ("IT");

INSERT INTO role (title, salary, department_id)
VALUES("Manager", 1000000, 1),
      ("Accountant", 80000, 2),
      ("Clerck", 40000, 3),
      ("Technician", 70000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES("Catherine", "Thorn", 1,  null),
      ("Cherry", "Smith", 2, 1),
      ("Nataly", "Mulin", 3, 1),
      ("Margaret", "Busco", 4, 1);