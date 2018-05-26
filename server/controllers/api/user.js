const bcrypt = require('bcrypt');
const db = require('../../model/db');
const sign = require('../../common/sign').sign;
const saltRounds = 10;

exports.login = async (req, res) => {
	try {
		const body = req.body;
		if (!body.account) {
			return res.json({
				err: 1,
				msg: '账号不能为空'
			});
		}
		if (!(body.password && body.password.length >= 6 && body.password.length <= 16)) {
			return res.json({
				err: 1,
				msg: '密码应为6-16位字符'
			});
		}
		const user = await new Promise((resolve, reject) => {
			const sql = 'select account, password from User where account=? or mobile=?';
			db.query(sql, [body.account, body.account], (err, users) => {
				if (err)
					reject(err);
				else
					resolve(users[0]);
			});
		});
		if (!user) {
			return res.json({
				err: 1,
				msg: '该用户不存在'
			});
		}
		const result = await new Promise((resolve, reject) => {
			bcrypt.compare(body.password, user.password, (err, result) => {
				if (err)
					reject(err);
				else
					resolve(result);
			});
		});
		if (result) {
			const token = await sign("account", user.account);
			const filling = await new Promise((resolve, reject) => {
				const sql = 'select filling from User where account=?';
				db.query(sql, [user.account], (err, users) => {
					if (err) {
						reject(err);
					} else {
						resolve(users[0].filling);
					}
				});
			});
			if (filling) {
				res.json({
					err: 0,
					msg: '登录成功',
					token
				});
			} else {
				res.json({
					warning: 1,
					msg: '登录成功，信息需要完善',
					token
				});
			}
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
		const body = req.body;
		if (!(body.account && body.account.length == 8)) {
			return res.json({
				err: 1,
				msg: '学号应该为8位'
			});
		}
		if (!(body.mobile && body.mobile.length == 11)) {
			return res.json({
				err: 1,
				msg: '手机号应该为11位'
			});
		}
		if (!(body.password && body.password.length >= 6 && body.password.length <= 16)) {
			return res.json({
				err: 1,
				msg: '密码应为6-16位字符'
			});
		}
		const usersCount = await new Promise((resolve, reject) => {
			const sql = 'select count(account) as count from User where account=?';
			db.query(sql, [body.account], (err, result) => {
				if (err)
					reject(err);
				else
					resolve(result[0].count);
			});
		});
		const mobilesCount = await new Promise((resolve, reject) => {
			const sql = 'select count(mobile) as count from User where mobile=?';
			db.query(sql, [body.mobile], (err, result) => {
				if (err)
					reject(err);
				else
					resolve(result[0].count);
			});
		});
		if (usersCount > 0) {
			return res.json({
				err: 1,
				msg: '该学号已经被注册'
			});
		}
		if (mobilesCount > 0) {
			return res.json({
				err: 1,
				msg: '该手机号已经被注册'
			});
		}
		body.password = await new Promise((resolve, reject) => {
			bcrypt.hash(body.password, saltRounds, (err, hash) => {
				if (err)
					reject(err);
				else
					resolve(hash);
			});
		});
		const ID = await new Promise((resolve, reject) => {
			const sql = 'select id from ID where account=?';
			db.query(sql, [body.account], (err, ids) => {
				if (err) {
					reject(err);
				} else {
					resolve(ids[0]);
				}
			});

		});
		if (ID) {
			body.id = ID.id;
		} else {
			body.id = null;
		}
		await new Promise((resolve, reject) => {
			const sql = 'insert into User(id, account, mobile, password) values(?, ?, ?, ?)';
			db.query(sql, [body.id, body.account, body.mobile, body.password], (err) => {
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
			err: 1,
			msg: '服务器出错了'
		});
	}
};
exports.mobileLogup = async (req, res) => {
	try {
		const body = req.body;
		if (!(body.account && body.account.length == 8)) {
			return res.json({
				err: 1,
				msg: '学号应该为8位'
			});
		}
		if (!(body.mobile && body.mobile.length == 11)) {
			return res.json({
				err: 1,
				msg: '手机号应该为11位'
			});
		}
		if (!(body.password && body.password.length >= 6 && body.password.length <= 16)) {
			return res.json({
				err: 1,
				msg: '密码为6-16位字符'
			});
		}
		if (!(body.name)) {
			return res.json({
				err: 1,
				msg: '姓名不能为空'
			});
		}
		if (body.gender == undefined) {
			return res.json({
				err: 1,
				msg: '性别不能为空'
			});
		}
		if (!(body.major)) {
			return res.json({
				err: 1,
				msg: '专业课不能为空'
			});
		}
		if (body.grade == undefined) {
			return res.json({
				err: 1,
				msg: '年级不能为空'
			});
		}
		const usersCount = await new Promise((resolve, reject) => {
			const sql = 'select count(account) as count from User where account=?';
			db.query(sql, [body.account], (err, result) => {
				if (err)
					reject(err);
				else
					resolve(result[0].count);
			});
		});
		const mobilesCount = await new Promise((resolve, reject) => {
			const sql = 'select count(mobile) as count from User where mobile=?';
			db.query(sql, [body.mobile], (err, result) => {
				if (err)
					reject(err);
				else
					resolve(result[0].count);
			});
		});
		if (usersCount > 0) {
			return res.json({
				err: 1,
				msg: '该学号已经被注册'
			});
		}
		if (mobilesCount > 0) {
			return res.json({
				err: 1,
				msg: '该手机号已经被注册'
			});
		}
		body.password = await new Promise((resolve, reject) => {
			bcrypt.hash(body.password, saltRounds, (err, hash) => {
				if (err)
					reject(err);
				else
					resolve(hash);
			});
		});
		const ID = await new Promise((resolve, reject) => {
			const sql = 'select id from ID where account=?';
			db.query(sql, [body.account], (err, ids) => {
				if (err) {
					reject(err);
				} else {
					resolve(ids[0]);
				}
			});

		});
		if (ID) {
			body.id = ID.id;
		} else {
			body.id = null;
		}
		await new Promise((resolve, reject) => {
			const sql = 'insert into User(id, account, mobile, password, name, gender, grade, major) values(?, ?, ?, ?, ?, ?, ?, ?)';
			db.query(sql, [body.id, body.account, body.mobile, body.password, body.name, body.gender, body.grade, body.major], (err) => {
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
exports.filling = async (req, res) => {
	try {
		const body = req.body;
		const account = req.session.user.account;
		if (!body.name) {
			return res.json({
				err: 1,
				msg: '姓名不能为空'
			});
		}
		if (!body.gender) {
			return res.json({
				err: 1,
				msg: '请选择性别'
			});
		} 
		if (!body.major) {
			return res.json({
				err: 1,
				msg: '专业不能为空'
			});
		}
		if (!body.grade) {
			return res.json({
				err: 1,
				msg: '请选择年级'
			});
		}
		await new Promise((resolve, reject) => {
			let sql = 'update User set filling=?, grade=?, major=?, name=?, gender=? where account=?';
			db.query(sql, [true, body.grade, body.major, body.name, body.gender, account], (err) => {
				if (err)
					reject(err);
				else
					resolve();
			});
		});
		res.json({
			err: 0,
			msg: '完善成功'
		});
	} catch (e) {
		res.json({
			err: 1,
			msg: '服务器出错了'
		});
	}
};
exports.editInfo = async (req, res) => {
	try {
		const body = req.body;
		const account = req.session.user.account;
		if (!body.name) {
			return res.json({
				err: 1,
				msg: '姓名不能为空'
			});
		}
		if (!body.gender) {
			return res.json({
				err: 1,
				msg: '请选择性别'
			});
		}
		if (!(body.mobile && body.mobile.length == 11)) {
			return res.json({
				err: 1,
				msg: '请输入11位手机号码'
			});
		}
		if (!body.major) {
			return res.json({
				err: 1,
				msg: '专业不能为空'
			});
		}
		if (!body.grade) {
			return res.json({
				err: 1,
				msg: '请选择年级'
			});
		}
		await new Promise((resolve, reject) => {
			const sql = 'update User set gender=?, grade=?, major=?, name=?, mobile=? where account=?';
			db.query(sql, [body.gender, body.grade, body.major, body.name, body.mobile, account], (err) => {
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
	try {
		const body = req.body;
		const account = req.session.user.account;
		const user = await new Promise((resolve, reject) => {
			const sql = 'select * from User where account=?';
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
		const users = await new Promise((resolve, reject) => {
			const sql = 'select id, name, grade, major, gender, mobile, account, forbidden from User';
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
		const body = req.body;
		await new Promise((resolve, reject) => {
			const sql = 'update User set forbidden=? where account=?';
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