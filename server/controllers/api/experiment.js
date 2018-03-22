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
			let sql = 'insert into Experiment(name, ip, address) values(?, ?, ?)';
			db.query(sql, [body.Name, body.IP, body.Address], (err) => {
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

exports.showExperiment = async (req, res) => {
	try {
		let experiments = await new Promise((resolve, reject) => {
			let sql = 'select * from Experiment';
			db.query(sql, (err, exps) => {
				if (err)
					reject(err);
				else
					resolve(exps);
			});
		});
		let tables = await new Promise((resolve, reject) => {
			let sql = 'select * from Tab';
			db.query(sql, (err, tabs) => {
				if (err)
					reject(err);
				else
					resolve(tabs);
			});
		});
		res.json({
			err: 0,
			experiments,
			tables
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