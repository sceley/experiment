const jwt = require('jsonwebtoken');
const config = require('../config');
exports.sign = async (key, value) => {
	const obj = {};
	obj[key] = value;
	let token = await new Promise((resolve, reject) => {
		jwt.sign(obj, config.jsonwebtoken.secret, (err, token) => {
			if (err) 
				reject(err);
			else
				resolve(token);
		});
	});
	return token;
};