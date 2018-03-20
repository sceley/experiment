const db = require('../../model/db');
const config = require('../../config');
const sign = require('../../common/sign').sign;
exports.login = async (req, res) => {
	let body = req.body;
	try {
		if (body.Account == config.admin.user && body.Password == config.admin.user) {
			let token = await sign('admin', 1);
			res.json({
				token,
				msg: '登陆成功'
			});
		} else {
			res.json({
				err: 1,
				msg: '帐号不存在或密码错误'
			});
		}
	} catch (e) {
		res.json({
			err: 1,
			msg: '服务器出错了'
		});
	}
};

exports.monitorExp = async (req, res) => {
	try {
		let data = await new Promise((resolve, reject) => {
			let sql = 'select * from Tab';
			db.query(sql, (err, data) => {
				if (err)
					reject(err);
				else
					resolve(data);
			});
		});
		res.json({
			err: 0,
			data
		});
	} catch (e) {
		res.json({
			err: 1,
			msg: '服务器出错了'
		});
	}
};

exports.monitorUser = async (req, res) => {
	try {
		let data = await new Promise((resolve, reject) => {
			let sql = 'select * from User';
			db.query(sql, (err, data) => {
				if (err)
					reject(err);
				else
					resolve(data);
			});
		});
		res.json({
			err: 0,
			data
		});
	} catch (e) {
		res.json({
			err: 1,
			msg: '服务器出错了'
		});
	}
};