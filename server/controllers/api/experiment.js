const db = require('../../model/db');
exports.addExp = async (req, res) => {
	try {
		const body = req.body;
		if (!body.name) {
			return res.json({
				err: 1,
				msg: '实验室名称不能为空'
			});
		}
		if (!body.ip) {
			return res.json({
				err: 1,
				msg: 'IP不能为空'
			});
		}
		if (!body.address) {
			return res.json({
				err: 1,
				msg: '实验室地址不能为空'
			});
		}
		if (!body.port) {
			return res.json({
				err: 1,
				msg: 'PORT不能为空'
			})
		}
		const expsCount = await new Promise((resolve, reject) => {
			const sql = 'select count(*) as count from Experiment where name=?';
			db.query(sql, [body.name], (err, exps) => {
				if (err)
					reject(err);
				else
					resolve(exps[0].count);
			});
		});
		if (expsCount > 0)
			return res.json({
				err: 1,
				msg: '该实验室已经存在'
			});
		await new Promise((resolve, reject) => {
			const sql = 'insert into Experiment(name, ip, port, address) values(?, ?, ?, ?)';
			db.query(sql, [body.name, body.ip, body.port, body.address], (err) => {
				if (err)
					reject(err);
				else
					resolve();
			});
		});
		const exp_id = await new Promise((resolve, reject) => {
			const sql = 'select id from Experiment where name=?';
			db.query(sql, [body.name], (err, exps) => {
				if (err)
					reject(err);
				else 
					resolve(exps[0].id);
			});
		});
		for (let i = 1; i <= body.tablesCount; i++)
			await new Promise((resolve, reject) => {
				const sql = 'insert into Tab(exp_id, seat) values(?, ?)';
				db.query(sql, [exp_id, i], err => {
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

exports.showExps = async (req, res) => {
	try {
		const exps = await new Promise((resolve, reject) => {
			const sql = `select Experiment.id, ip, port, count(Tab.id) as tablesCount, 
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
		res.json({
			err: 1,
			msg: '服务器出错了'
		});
	}
};

exports.showRestExps = async (req, res) => {
	try {
		const body = req.body;
		const reserves = await new Promise((resolve, reject) => {
			const sql = 'select exp_id, seat from Reserve where date=? and ((start<? and start>=?) or (end<=? and end>?) or (start=? and end=?))';
			db.query(sql, [body.date, body.end, body.start, body.end, body.start, body.start, body.end], (err, reserves) => {
				if (err)
					reject(err);
				else
					resolve(reserves);
			});
		});
		const exps = await new Promise((resolve, reject) => {
			const sql = 'select Experiment.id, name, count(Tab.id) as tablesCount from Experiment left join Tab on Experiment.id=Tab.exp_id group by Experiment.id';
			db.query(sql, (err, exps) => {
				if (err)
					reject(err);
				else 
					resolve(exps);
			});
		});
		let fault_tabs = await new Promise((resolve, reject) => {
			let sql = 'select id, exp_id from Tab where fault=?';
			db.query(sql, [1], (err, tabs) => {
				if (err)
					reject(err);
				else
					resolve(tabs);
			});
		});
		res.json({
			err: 0,
			reserves,
			exps,
			fault_tabs
		});
	} catch (e) {
		res.json({
			err: 1,
			msg: '服务器出错了'
		});
	}
};

exports.showExpsStatus = async (req, res) => {
	try {
		let exps = await new Promise((resolve, reject) => {
			let sql = `select Experiment.id, name, sum(status) as people from Experiment 
			left join Tab on Tab.exp_id=Experiment.id group by Experiment.id`;
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
	try {
		let body = req.body;
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
		for (let i = 1; i <= body.tablesCount; i++) {
			await new Promise((resolve, reject) => {
				let sql = 'insert into Tab(exp_id, seat) values(?, ?)';
				db.query(sql, [body.id, i], err => {
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
		console.log(e);
		res.json({
			err: 1,
			msg: '服务器出错了'
		});
	}
};

exports.monitorExp = async (req, res) => {
	try {
		let id = req.params.id;
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