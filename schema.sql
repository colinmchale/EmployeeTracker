drop database if exists employee_db;

create database employee_db;

create table employee(
    id int primary key auto_increment,
    name varchar(30),
    role_id int,
);

insert into employee (id, name, role_id) values (1, 'Jason Day', 1)