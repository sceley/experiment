const jwt = require('jsonwebtoken');
const config = require('../config');
exports.session = async (req, res, next) => {
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
		req.session = session;	
		next();
	} catch (e) {
		res.json({
			err: 1,
			msg: '用户还未登陆'
		});
	}
};

exports.admin_session = async (req, res) => {
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
		req.session = session;
	} catch (e) {
		res.json({
			err: 1,
			msg: '用户还未登陆'
		});
	}
}