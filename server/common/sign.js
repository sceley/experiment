const jwt = require('jsonwebtoken');
const config = require('../config');
exports.sign = async (name, id) => {
	let expire = Math.floor(Date.now() / 1000) + 60 * config.jsonwebtoken.exp;
	let obj = {};
	obj[name] = id;
	obj.exp = expire;
	let token = jwt.sign(obj, config.jsonwebtoken.secret);
	return token;
};