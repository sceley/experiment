const jwt = require('jsonwebtoken');
const moment = require('moment');
const config = require('../config');
exports.sign = async (name, id) => {
	let obj = {
		exp: Math.floor(Date.now() / 1000) + (60 * 60)
	};
	// let obj = {};
	obj[name] = id;
	// console.log(obj);
	// console.log(config.jsonwebtoken.secret);
	let token = jwt.sign(obj, config.jsonwebtoken.secret);
	// let token = jwt.sign(obj, config.jsonwebtoken.secret, {
	// 	expiresIn: '1h'
	// });
	// console.log(token);
	return token;
};