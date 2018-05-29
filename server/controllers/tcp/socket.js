const net = require('net');
const moment = require('moment');
const db = require('../../model/db');
const convert_to_obj = require('../../common/convert').convert_to_obj;
const sendEmail = require('../../common/email').sendEmail;
// const sockets  = [];
// let sockets_cnt = 0;

// exports.socket = async socket => {
// 	sockets.push(socket);
// 	sockets_cnt++;
// 	socket.on('data', data => {
// 		handleResponse(data.toString());
// 	});
// 	socket.on('end', () => {
// 		for (let i = 0; i < sockets_cnt; i++) {
// 			if (sockets[i] == socket) {
// 				for (; i < sockets_cnt - 1; i++) {
// 					sockets[i] = sockets[i + 1];
// 				}
// 				sockets_cnt--;
// 				break;
// 			}
// 		}
// 	});
// };

let sockets  = [];

exports.socket = async socket => {
	sendEmail();
	console.log("有新连接");
	sockets.push(socket);
	socket.setKeepAlive(true);
	socket.on('data', data => {
		console.log(data.toString());
		handleResponse(data.toString());
	});
	socket.on('end', () => {
		console.log('断开连接');
		let tmp = [];
		for (let i = 0; i < sockets.length; i++) {
			if (sockets[i] != socket) {
				tmp.push(sockets[i]);
			}
		}
		sockets = tmp;
	});
};

exports.send = async (str) => {
	for (let i = 0; i < sockets.length; i++) {
		sockets[i].write(str);
	}
};

async function handleResponse (str) {
	try {
		console.log(str.length);
		if (str.length == 15) {
			const account = str.slice(3, 11);
			const id = str.slice(13);
			await new Promise((resolve, reject) => {
				const sql = 'insert into ID(account, id) values(?, ?)';
				db.connection.query(sql, [account, id], err => {
					if (err) {
						reject(err);
					} else {
						resolve();
					}
				});
			});
			await new Promise((resolve, reject) => {
				const sql = 'update User set id=? where account=?';
				db.connection.query(sql, [id, account], err => {
					if (err) {
						reject(err);
					} else {
						resolve();
					}
				});
			});
		} else if (str.length == 25) {
			const pattern = /(NUM)(\d{4})(EXP)(\d{2})(TAB)(\d{2})(ID)(\d{2})(POW)(\d{1})/;
			if (!pattern.test(str))
				return;
			const json = convert_to_obj(str, pattern);
			const time = moment().format('YYYY-MM-DD HH:mm:ss');
			await new Promise((resolve, reject) => {
				const sql = 'update Tab set status=? where seat=? and exp_id=?';
				db.connection.query(sql, [1, parseInt(json.TAB), parseInt(json.EXP)], err => {
					if (err)
						reject(err);
					else
						resolve();
				});
			});
			await new Promise((resolve, reject) => {
				const sql = 'update Reserve set status=?, go_into_time=? where id=?';
				db.connection.query(sql, [2, time, parseInt(json.NUM)], err => {
					if (err)
						reject();
					else
						resolve();
				});
			});
		} else if (str.length == 30) {
			const pattern = /(NUM)(\d{4})(EXP)(\d{2})(TAB)(\d{2})(ID)(\d{2})(POW)(\d{1})(FAU)(\d{1})/;
			if (!pattern.test(str))
				return;
			const json = convert_to_obj(str, pattern);
			const time = moment().format('YYYY-MM-DD HH:mm:ss');
			await new Promise((resolve, reject) => {
				const sql = 'update Tab set status=?, fault=? where seat=? and exp_id=?';
				db.connection.query(sql, [parseInt(json.POW), parseInt(json.FAU), parseInt(json.TAB), parseInt(json.EXP)], err => {
					if (err)
						reject(err);
					else
						resolve();
				});
			});
			if (parseInt(json.POW)) {
				await new Promise((resolve, reject) => {
					const sql = 'update Reserve set status=?, go_into_time=? where id=?';
					db.connection.query(sql, [2, time, parseInt(json.NUM)], err => {
						if (err)
							reject();
						else
							resolve();
					});
				});
			} else {
				await new Promise((resolve, reject) => {
					const sql = 'update Reserve set status=?, leave_time=? where id=?';
					db.connection.query(sql, [3, time, parseInt(json.NUM)], err => {
						if (err)
							reject();
						else
							resolve();
					});
				});
			}
		}
	} catch (e) {
		console.log(e);
	}
};