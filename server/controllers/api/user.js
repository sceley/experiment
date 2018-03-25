const bcrypt = require('bcrypt');
const db = require('../../model/db');
const sign = require('../../common/sign').sign;
const saltRounds = 10;

exports.login = async (req, res) => {
	let body = req.body;
	try {
		let user = await new Promise((resolve, reject) => {
			let sql = 'select id, password from User where account=? or mobile=?';
			db.query(sql, [body.Account, body.Account], (err, users) => {
				if (err)
					reject(err);
				else
					resolve(users[0]);
			});
		});
		if (!user) {
			res.json({
				err: 1,
				msg: '该用户不存在'
			});
		}
		let result = await new Promise((resolve, reject) => {
			bcrypt.compare(body.Password, user.password, (err, result) => {
				if (err)
					reject(err);
				else
					resolve(result);
			});
		});
		if (result) {
			let token = await sign("uid", user.id);
			res.json({
				err: 0,
				msg: '登录成功',
				token
			});
		} else {
			res.json({
				err: 1,
				msg: '密码错误'
			});
		}
	} catch (e) {
		res.json({
			err: 1,
			msg: '服务器出错了'
		});
	}

};
exports.logup = async (req, res) => {
	let body = req.body;
	try {
		let users = await new Promise((resolve, reject) => {
			let sql = 'select account from User where account=?';
			db.query(sql, [body.Account], (err, users) => {
				if (err)
					reject(err);
				else
					resolve(users);
			});
		});
		if (users.length > 0) {
			return res.json({
				err: 1,
				msg: '该学号已经被注册'
			});
		}
		body.Password = await new Promise((resolve, reject) => {
			bcrypt.hash(body.Password, saltRounds, (err, hash) => {
				if (err)
					reject(err);
				else
					resolve(hash);
			});
		});
		await new Promise((resolve, reject) => {
			let sql = 'insert into User(account, mobile, password) values(?, ?, ?)';
			db.query(sql, [body.Account, body.Mobile, body.Password], (err) => {
				if (err)
					reject(err);
				else
					resolve();
			});
		});
		res.json({
			err: 0,
			msg: '注册成功'
		});
	} catch (e) {
		res.json({
			err: 1
		});
	}
};
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


//admin
exports.showUsers = async (req, res) => {
	try {
		let users = await new Promise((resolve, reject) => {
			let sql = 'select id, name, grade, major, sex, mobile, account, forbidden, active from User';
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