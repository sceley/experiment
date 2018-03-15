const mysql = require('mysql');
const config = require('../config');
const connection = mysql.createConnection(config.db);

connection.connect();

const table1 = `create table if not exists Admin (
				id int unsigned auto_increment,
				account varchar(15),
				name varchar(15),
				password varchar(100),
				primary key(id))
				charset=utf8`;

const table2 = `create table if not exists User (
				id int unsigned auto_increment,
				account varchar(15),
				name varchar(15),
				password varchar(100),
				sex varchar(5),
				major varchar(25),
				mobile varchar(11),
				grade varchar(10),
				primary key(id))
				charset=utf8`;

const table3 = `create table if not exists Experiment (
				id int unsigned auto_increment,
				ip varchar(20),
				name varchar(15),
				address varchar(15),
				experiment_status boolean default 0,
				door boolean default 0,
				primary key(id))
				charset=utf8`;

const table4 = `create table if not exists Tab (
				id int unsigned auto_increment,
				exp_id int unsigned,
				status boolean default 0,
				power_status boolean default 0,
				primary key(id), 
				foreign key(exp_id) references Experiment(id))
				charset=utf8`;

const table5 = `create table if not exists Reserve (
				id int unsigned auto_increment,
				user_id int unsigned,
				exp_id int unsigned,
				table_id int unsigned,
				precious_thing varchar(30),
				status boolean default 0,
				approver varchar(15),
				complete_status boolean default 0,
				primary key(id))
				charset=utf8`;
				
connection.query(table1);
connection.query(table2);
connection.query(table3);
connection.query(table4);
connection.query(table5);

module.exports = connection;