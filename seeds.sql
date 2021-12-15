
USE employee_db;

INSERT INTO department (name)
VALUES  ("Sales"),
        ("Legal"),
        ("Finance"),
        ("Marketing");

INSERT INTO role (title, salary, department_id)
VALUES  ("Sales Lead", 10000, 1),
        ("Salesperson", 80000, 1),
        ("Legal Lead", 200000, 2),
        ("Lawyer", 150000, 2),
        ("Accountant", 125000, 3),
        ("Marketing Director", 90000, 4),
        ("Marketing Analyst", 70000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES  ("Jerry", "Simmons", 2, 2),
        ("Sarah", "Killian", 1, null),
        ("Ashley", "Henricks", 3, null),
        ("Leslie", "Wilson", 4, 7),
        ("Andy", "Wright", 2, 2),
        ("Macy", "Mack", 7, 8),
        ("Courtland", "Sutton", 2, null),
        ("Will", "Anderson", 6, null);