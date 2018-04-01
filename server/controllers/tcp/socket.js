const net = require('net');
const db = require('../../model/db');
const handleResponse = require("../../common/handlesocket").handleResponse;
exports.socket = async socket => {
	try {
		let res = await new Promise((resolve, reject) => {
			socket.on('data', res => {
				socket.end();
				resolve(res.toString());
			});
		});
		return console.log(res);
		await handleResponse(res);
		// let start = socket.remoteAddress.search(/\d{1}/);
		// let ip = socket.remoteAddress.slice(start);
		// let port = socket.remotePort;
	} catch (e) {
		console.log(e);
	}
};