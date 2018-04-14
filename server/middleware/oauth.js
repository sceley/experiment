const jwt = require('jsonwebtoken');
const config = require('../config');
const db = require('../model/db');
exports.user_session = async (req, res, next) => {
	let token = req.headers['x-access-token'];
	try {
		let session = await new Promise((resolve, reject) => {
			jwt.verify(token, config.jsonwebtoken.secret, (err, session) => {
				if (err)
					reject(err);
				else
					resolve(session);
			});
		});
		if (session.account) {
			req.user_session = session;	
			next();
		} else {
			res.json({
				err: 1,
				msg: '用户还未登陆'
			});
		}
	} catch (e) {
		res.json({
			err: 1,
			msg: '用户还未登陆'
		});
	}
};
exports.oauthUser = async (req, res, next) => {
	try {
		let account = req.user_session.account;
		let user = await new Promise((resolve, reject) => {
			let sql = 'select forbidden from User where account=?';
			db.query(sql, [account], (err, users) => {
				if (err)
					reject(err);
				else 
					resolve(users[0]);
			});
		});
		if (user.forbidden) {
			return res.json({
				err: 1,
				msg: '您的账号已经被禁用'
			});
		}
		next();
	} catch (e) {
		res.json({
			err: 1,
			msg: '服务器出错了'
		});
	}
};

exports.authFinger = async (req, res, next) => {
	try {
		const account = req.user_session.account;
		const user = await new Promise((resolve, reject) => {
			const sql = 'select * from User where account=?';
			db.query(sql, [account], (err, users) => {
				if (err) {
					reject(err);
				} else {
					resolve(users[0]);
				}
			});
		});
		if (user.id) {
			next();
		} else {
			res.json({
				err: 1,
				msg: '请先到实验室入指纹'
			});
		}
	} catch (e) {
		res.json({
			err: 1,
			msg: '服务器出错了'
		});
	}
}

exports.admin_session = async (req, res, next) => {
	let token = req.headers['x-access-token'];
	try {
		let session = await new Promise((resolve, reject) => {
			jwt.verify(token, config.jsonwebtoken.secret, (err, session) => {
				if (err)
					reject(err);
				else
					resolve(session);
			});
		});
		if (session.admin) {
			req.admin_session = session;
			next();
		} else {
			res.json({
				err: 1,
				msg: '用户还未登陆'
			});
		}
	} catch (e) {
		res.json({
			err: 1,
			msg: '用户还未登陆'
		});
	}
};