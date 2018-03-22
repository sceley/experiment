const jwt = require('jsonwebtoken');
const config = require('../config');
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