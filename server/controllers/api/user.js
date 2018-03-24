const db = require('../../model/db');
exports.editInfo = async (req, res) => {
	let body = req.body;
	let id = req.user_session.uid;
	try {
		if (!body.Name) {
			return res.json({
				err: 1,
				msg: '姓名不能为空'
			});
		}
		if (!body.Sex) {
			return res.json({
				err: 1,
				msg: '请选择性别'
			});
		}
		if (!(body.Mobile && body.Mobile.length == 11)) {
			return res.json({
				err: 1,
				msg: '请输入11位手机号码'
			});
		}
		if (!body.Major) {
			return res.json({
				err: 1,
				msg: '专业不能为空'
			});
		}
		if (!body.Grade) {
			return res.json({
				err: 1,
				msg: '请选择年级'
			});
		}
		await new Promise((resolve, reject) => {
			let sql = 'update User set sex=?, grade=?, major=?, name=?, mobile=?, active=? where id=?';
			db.query(sql, [body.Sex, body.Grade, body.Major, body.Name, body.Mobile, true, id], (err) => {
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
};

exports.showUsers = async (req, res) => {
	try {
		let users = await new Promise((resolve, reject) => {
			let sql = 'select * from User';
			db.query(sql, (err, users) => {
				if (err) 
					reject(err);
				else
					resolve(users);
			});
		});
		res.json({
			err: 0,
			users
		});
	} catch (e) {
		res.json({
			err: 1,
			msg: '服务出错了'
		});
	}
};

exports.monitorUser = async (req, res) => {
	let body = req.body;
	try {
		await new Promise((resolve, reject) => {
			let sql = 'update User set forbidden=? where id=?';
			db.query(sql, [body.forbidden, body.id], err => {
				if (err) 
					reject(err);
				else
					resolve();
			});
		});
		res.json({
			err: 0,
			msg: '用户的权限设置成功'
		});
	} catch (e) {
		res.json({
			err: 1,
			msg: '服务器出错了'
		});
	}
};