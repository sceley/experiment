const net = require('net');
const moment = require('moment');
const db = require('../../model/db');
const convert_to_obj = require('../../common/convert').convert_to_obj;
let sockets  = [];

exports.socket = async socket => {
	sockets.push(socket);
	socket.on('data', data => {
		handleResponse(data.toString());
	});
	socket.on('end', () => {
		const tmp = [];
		for (let i = 0; i < sockets.length; i++) {
			if (sockets[i] != socket) {
				tmp.push(socket[i]);
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
		if (str.length == 15) {
			const account = str.slice(3, 11);
			const id = str.slice(13);
			await new Promise((resolve, reject) => {
				const sql = 'insert into ID(account, id) values(?, ?)';
				db.query(sql, [account, id], err => {
					if (err) {
						reject(err);
					} else {
						resolve();
					}
				});
			});
			await new Promise((resolve, reject) => {
				const sql = 'update User set id=? where account=?';
				db.query(sql, [id, account], err => {
					if (err) {
						reject(err);
					} else {
						resolve();
					}
				});
			});
		} else {
			const res = convert_to_obj(str);
			const time = moment().format('YYYY-MM-DD HH:mm:ss');
			await new Promise((resolve, reject) => {
				const sql = 'update Tab set status=?, fault=? where seat=? and exp_id=?';
				db.query(sql, [parseInt(res.POW), parseInt(res.FAU), parseInt(res.TAB), parseInt(res.EXP)], err => {
					if (err)
						reject(err);
					else
						resolve();
				});
			});
			if (parseInt(res.POW)) {
				await new Promise((resolve, reject) => {
					const sql = 'update Reserve set status=?, go_into_time=? where id=?';
					db.query(sql, [2, time, parseInt(res.NUM)], err => {
						if (err)
							reject();
						else
							resolve();
					});
				});
			} else {
				await new Promise((resolve, reject) => {
					const sql = 'update Reserve set status=?, leave_time=? where id=?';
					db.query(sql, [3, time, parseInt(res.NUM)], err => {
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