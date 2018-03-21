const db = require('../../model/db');
exports.editInfo = async (req, res) => {
	let body = req.body;
	let id = req.user_session.uid;
	try {
		let users = await new Promise((resolve, reject) => {
			let sql = 'select id from User where account=?';
			db.query(sql, [body.SchoolNumber], (err, users) => {
				if (err)
					reject(err);
				else
					resolve(users);
			});
		});
		if (users.length > 0) {
			let flag = false;
			for (let i = 0; i　< users.length; i++) {
				if (users[i].id === id) {
					flag = true;
					break;
				}
			}
			if (!flag) {
				res.json({
					err: 1,
					msg: '该学号已经被使用'
				});
			}
		}
		await new Promise((resolve, reject) => {
			let sql = 'update User set account=?, sex=?, grade=?, major=?, name=?, mobile=? where id=?';
			db.query(sql, [body.SchoolNumber, body.Sex, body.Grade, body.Major, body.Name, body.Mobile, id], (err) => {
				if (err)
					reject(err);
				else 
					resolve();
			});
		});
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

exports.showInfo = async (req, res) => {
	let body = req.body;
	let id = req.user_session.uid;
	try {
		let user = await new Promise((resolve, reject) => {
			let sql = 'select * from User where id=?';
			db.query(sql, [id], (err, users) => {
				if (err) 
					reject(err);
				else
					resolve(users[0]);
			});
		});
		delete user.password;
		res.json({
			err: 0,
			user
		});
	} catch (e) {
		res.json({
			err: 1,
			msg: '服务器出错了'
		});
	}
}