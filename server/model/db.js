const mysql = require('mysql');
const config = require('../config');
const json = {connection: null};
function handleDisconnect() {
	json.connection = mysql.createConnection(config.db);
	json.connection.connect(err => {
		if (err) {
			console.log('error when connecting to db:', err);
			setTimeout(handleDisconnect, 2000);
		}
	});
	json.connection.on('error', err => {
		console.log('db error', err);
		if (err.code === 'PROTOCOL_CONNECTION_LOST') {
			handleDisconnect();
		} else {
			throw err;
		}
	});
};
handleDisconnect();

const table1 = `create table if not exists Admin (
				account varchar(15) unique,
				name varchar(15),
				password varchar(100), 
				primary key(account))
				charset=utf8`;

const table2 = `create table if not exists User (
				account varchar(8) not null,
				id int unsigned,
				name varchar(15),
				password varchar(100),
				gender boolean default true,
				major varchar(25),
				mobile varchar(11),
				grade int,
				forbidden boolean default false,
				filling boolean default false,
				primary key(account))
				charset=utf8`;

const table3 = `create table if not exists Experiment (
				id int unsigned auto_increment,
				name varchar(15),
				ip varchar(20),
				port varchar(10),
				address varchar(15),
				primary key(id))
				charset=utf8`;

const table4 = `create table if not exists Tab (
				id int unsigned auto_increment,
				seat int unsigned,
				exp_id int unsigned,
				status boolean default false,
				fault boolean default false,
				primary key(id), 
				foreign key(exp_id) references Experiment(id))
				charset=utf8`;
/*status:
	0 电源关闭状态
	1 电源打开状态
*/

const table5 = `create table if not exists Reserve (
				id int unsigned auto_increment,
				createAt datetime,
				date date,
				start time,
				end time,
				go_into_time datetime,
				leave_time datetime,
				equipment varchar(30),
				approver varchar(15),
				status tinyint(1),
				user_id varchar(8),
				exp_id int unsigned,
				seat int unsigned,
				primary key(id))
				charset=utf8`;
/*status:
	0 待审核
	1 已审核
	2 执行中
	3 已执行
*/

const table6 = `create table if not exists Notification (
				id int unsigned auto_increment,
				title varchar(50),
				createAt datetime,
				msg longtext,
				author varchar(20),
				primary key(id))
				charset=utf8`;

const table7 = `create table if not exists Feedback (
				id int unsigned auto_increment,
				message longtext,
				createAt datetime,
				author varchar(15),
				reply longtext,
				replyable boolean default true,
				primary key(id))
				charset=utf8`;

const table8 = `create table if not exists ID (
				id int unsigned not null,
				account varchar(8) unique,
				primary key(id))
				charset=utf8`;
				
json.connection.query(table1);
json.connection.query(table2);
json.connection.query(table3);
json.connection.query(table4);
json.connection.query(table5);
json.connection.query(table6);
json.connection.query(table7);
json.connection.query(table8);

module.exports = json;