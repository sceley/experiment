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
		if (session.uid) {
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
	let uid = req.user_session.uid;
	try {
		let user = await new Promise((resolve, reject) => {
			let sql = 'select active, forbidden from User where account=?';
			db.query(sql, [uid], (err, users) => {
				if (err)
					reject(err);
				else 
					resolve(users[0]);
			});
		});
		if (!user.active) {
			return res.json({
				err: 1,
				msg: '您的账号未激活，请完善你的信息'
			});
		}
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