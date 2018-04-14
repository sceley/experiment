const bcrypt = require('bcrypt');
const db = require('../../model/db');
const sign = require('../../common/sign').sign;
const saltRounds = 10;

exports.login = async (req, res) => {
	try {
		let body = req.body;
		if (!body.Account) {
			return res.json({
				err: 1,
				msg: '账号不能为空'
			});
		}
		if (!(body.Password && body.Password.length >= 6 && body.Password.length <= 16)) {
			return res.json({
				err: 1,
				msg: '密码应为6-16位字符'
			});
		}
		let user = await new Promise((resolve, reject) => {
			let sql = 'select account, password from User where account=? or mobile=?';
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
			let token = await sign("account", user.account);
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
	try {
		let body = req.body;
		if (!(body.Account && body.Account.length == 8)) {
			return res.json({
				err: 1,
				msg: '学号应该为8位'
			});
		}
		if (!(body.Mobile && body.Mobile.length == 11)) {
			return res.json({
				err: 1,
				msg: '手机号应该为11位'
			});
		}
		let users_count = await new Promise((resolve, reject) => {
			let sql = 'select count(account) as count from User where account=?';
			db.query(sql, [body.Account], (err, result) => {
				if (err)
					reject(err);
				else
					resolve(result[0].count);
			});
		});
		let mobiles_count = await new Promise((resolve, reject) => {
			let sql = 'select count(mobile) as count from User where mobile=?';
			db.query(sql, [body.Mobile], (err, result) => {
				if (err)
					reject(err);
				else
					resolve(result[0].count);
			});
		});
		if (users_count > 0) {
			return res.json({
				err: 1,
				msg: '该学号已经被注册'
			});
		}
		if (mobiles_count > 0) {
			return res.json({
				err: 1,
				msg: '该手机号已经被注册'
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
		const Oid = await new Promise((resolve, reject) => {
			const sql = 'select id from ID where account=?';
			db.query(sql, [body.Account], (err, ids) => {
				if (err) {
					reject(err);
				} else {
					resolve(ids[0]);
				}
			});

		});
		if (Oid) {
			body.ID = Oid.id;
		} else {
			body.ID = null;
		}
		await new Promise((resolve, reject) => {
			let sql = 'insert into User(id, account, mobile, password) values(?, ?, ?, ?)';
			db.query(sql, [body.ID, body.Account, body.Mobile, body.Password], (err) => {
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
		console.log(e);
		res.json({
			err: 1,
			msg: '服务器出错了'
		});
	}
};
exports.editInfo = async (req, res) => {
	try {
		let body = req.body;
		let account = req.user_session.account;
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
			let sql = 'update User set sex=?, grade=?, major=?, name=?, mobile=? where account=?';
			db.query(sql, [body.Sex, body.Grade, body.Major, body.Name, body.Mobile, account], (err) => {
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
	let account = req.user_session.account;
	try {
		let user = await new Promise((resolve, reject) => {
			let sql = 'select * from User where account=?';
			db.query(sql, [account], (err, users) => {
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
			let sql = 'select id, name, grade, major, sex, mobile, account, forbidden from User';
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
	try {
		let body = req.body;
		await new Promise((resolve, reject) => {
			let sql = 'update User set forbidden=? where account=?';
			db.query(sql, [body.forbidden, body.account], err => {
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