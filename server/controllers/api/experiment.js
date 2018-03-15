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
				err: 1
			});
		await new Promise((resolve, reject) => {
			let sql = 'insert into Experiment(name, ip, address) values(?, ?, ?)';
			db.query(sql, [body.Name, body.IP, body.Adderss], (err) => {
				if (err)
					reject(err);
				else
					resolve();
			});
		});
		for (let i = 0; i < body.TableCount; i++)
			await new Promise((resolve, reject) => {
				let sql = 'insert into '
			});
	} catch (e) {

	}
};