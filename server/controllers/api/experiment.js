const db = require('../../model/db');
exports.addExperiment = async (req, res) => {
	let body = req.body;
	try {
		let exps = await new Promise((resolve, reject) => {
			let sql = 'select * from Experiment where name=?';
			db.query(sql, [body.Name], (err, exps) => {
				if (err)
					reject(err);
				else
					resolve(exps);
			});
		});
		if (exps.length > 0)
			return res.json({
				err: 1,
				msg: '该实验室已经存在'
			});
		await new Promise((resolve, reject) => {
			let sql = 'insert into Experiment(name, ip, port, address) values(?, ?, ?, ?)';
			db.query(sql, [body.Name, body.IP, body.Port, body.Address], (err) => {
				if (err)
					reject(err);
				else
					resolve();
			});
		});
		let exp_id = await new Promise((resolve, reject) => {
			let sql = 'select id from Experiment where name=?';
			db.query(sql, [body.Name], (err, exps) => {
				if (err)
					reject(err);
				else 
					resolve(exps[0].id);
			});
		});
		for (let i = 0; i < body.TableCount; i++)
			await new Promise((resolve, reject) => {
				let sql = 'insert into Tab(exp_id) values(?)';
				db.query(sql, [exp_id], err => {
					if (err)
						reject(err);
					else 
						resolve();
				});
			});
		res.json({
			err: 0,
			msg: '添加成功'
		});
	} catch (e) {
		res.json({
			err: 1,
			msg: '服务器出错了'
		});
	}
};

exports.monitorExp = async (req, res) => {
	let id = req.params.id;
	try {
		let tables = await new Promise((resolve, reject) => {
			let sql = 'select * from Tab where exp_id=?';
			db.query(sql, [id], (err, tables) => {
				if (err) 
					reject(err);
				else
					resolve(tables);
			});
		});
		res.json({
			err: 0,
			tables
		});
	} catch (e) {
		res.json({
			err: 1,
			msg: '服务器出错了'
		});
	}
};

exports.showExps = async (req, res) => {
	try {
		let exps = await new Promise((resolve, reject) => {
			let sql = `select Experiment.id, ip, port, count(Tab.id) as tablesCount, 
			address, name from Experiment left join Tab on 
			Experiment.id=Tab.exp_id group by Experiment.id`;
			db.query(sql, (err, exps) => {
				if (err)
					reject(err);
				else
					resolve(exps);
			});
		});
		res.json({
			err: 0,
			exps
		});
	} catch (e) {
		console.log(e);
		res.json({
			err: 1,
			msg: '服务器出错了'
		});
	}
};

exports.showRestExps = async (req, res) => {
	let body = req.body;
	try {
		let reserves = await new Promise((resolve, reject) => {
			let sql = 'select exp_id, table_id from Reserve where date=? and ((start<? and start>=?) or (end<=? and end>?) or (start=? and end=?))';
			db.query(sql, [body.Date, body.End, body.Start, body.End, body.Start, body.Start, body.End], (err, reserves) => {
				if (err) 
					reject(err);
				else
					resolve(reserves);
			});
		});
		let exps = await new Promise((resolve, reject) => {
			let sql = 'select Experiment.id, name, count(Tab.id) as tablesCount from Experiment left join Tab on Experiment.id=Tab.exp_id group by Experiment.id';
			db.query(sql, (err, exps) => {
				if (err)
					reject(err);
				else 
					resolve(exps);
			});
		});
		res.json({
			err: 0,
			reserves,
			exps
		});
	} catch (e) {
		console.log(e);
		res.json({
			err: 1,
			msg: '服务器出错了'
		});
	}
};

exports.expsCount = async (req, res) => {
	try {
		let exps = await new Promise((resolve, reject) => {
			let sql = 'select id, name, door, status from Experiment';
			db.query(sql, (err, exps) => {
				if (err)
					reject(err);
				else 
					resolve(exps);
			});
		});
		res.json({
			err: 0,
			exps
		});
	} catch (e) {
		res.json({
			err: 1,
			msg: '服务器出错了'
		});
	}
};

exports.editExp = async (req, res) => {
	let body = req.body;
	try {
		await new Promise((resolve, reject) => {
			let sql = 'update Experiment set name=?, ip=?, port=?, address=? where id=?';
			db.query(sql, [body.name, body.ip, body.port, body.address, body.id], err => {
				if (err)
					reject(err);
				else
					resolve();
			});
		});
		await new Promise((resolve, reject) => {
			let sql = 'delete from Tab where exp_id=?';
			db.query(sql, [body.id], err => {
				if (err)
					reject(err);
				else
					resolve();
			});
		});
		for (let i = 0; i <= body.tablesCount; i++) {
			await new Promise((resolve, reject) => {
				let sql = 'insert into Tab(exp_id) values(?)';
				db.query(sql, [body.id], err => {
					if (err)
						reject(err);
					else
						resolve();
				});
			});
		}
		res.json({
			err: 0,
			msg: '修改成功'
		});
	} catch (e) {
		res.json({
			err: 1,
			msg: '服务器出错了'
		});
	}
};

exports.switchExp = async (req, res) => {
	let body = req.body;
	try {
		await new Promise((resolve, reject) => {
			let sql = 'update Experiment set door=? where id=?';
			db.query(sql, [body.status, body.id], err => {
				if (err)
					reject(err);
				else
					resolve();
			});
		});
		res.json({
			err: 0,
			msg: '开关拨动成功'
		});
	} catch (e) {
		res.json({
			err: 1,
			msg: '服务器出错了'
		});
	}
};