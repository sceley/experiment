const db = require('../../model/db');
const net = require('net');
exports.socket = async socket => {
	try {
		let res = await new Promise((resolve, reject) => {
			socket.on('data', buf => {
				let res = splitData(buf.toString());
				resolve(res);
			});
		});
		// let start = socket.remoteAddress.search(/\d{1}/);
		// let ip = socket.remoteAddress.slice(start);
		// let port = socket.remotePort;
		await new Promise((resolve, reject) => {
			let sql = 'update Experiment set door=? where id=?';
			db.query(sql, [parseInt(res.DOR), parseInt(res.EXP)], err => {
				if (err)
					reject(err);
				else
					resolve();
			});
		});
		await new Promise((resolve, reject) => {
			let sql = 'update Tab set power_status=? where seat=? and exp_id=?';
			db.query(sql, [parseInt(res.POW), parseInt(res.TAB), parseInt(res.EXP)], err => {
				if (err)
					reject(err);
				else
					resolve();
			});
		});
		await new Promise((resolve, reject) => {
			let sql = 'update Reserve set complete_status=? where id=?';
			db.query(sql, [1, parseInt(res.NUM)], err => {
				if (err)
					reject();
				else
					resolve();
			});
		});
	} catch (e) {
		console.log(e);
	}
};
exports.send = async (options) => {
	while (options.reserve_id.length !== 4) {
		options.reserve_id = '0' + options.reserve_id;
	}
	while (options.Exp.length !== 2) {
		options.Exp = '0' + options.Exp;
	}
	while (options.Tab.length !== 2) {
		options.Tab = '0' + options.Tab;
	}
	let msg = `NUM${options.reserve_id}EXP${options.Exp}TAB${options.Tab}ID${options.id}POW${1}DOR${1}FAU${1}`;
	try {
		const client = net.createConnection({ host: options.ip, port: options.port }, () => {
			client.write(msg);
			client.end();
			client.on("close", () => {
				console.log("关闭成功");
			});
		});
	} catch (e) {
		console.log(e);
	}
};