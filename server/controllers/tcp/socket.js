const net = require('net');
const db = require('../../model/db');
const handleResponse = require('../../common/handlesocket').handleResponse;
exports.socket = async socket => {
	try {
		let res = await new Promise((resolve, reject) => {
			socket.on('data', buf => {
				resolve(buf.toString());
			});
		});
		await handleResponse(res);
		// let start = socket.remoteAddress.search(/\d{1}/);
		// let ip = socket.remoteAddress.slice(start);
		// let port = socket.remotePort;
	} catch (e) {
		console.log(e);
	}
};
exports.send = (str, options) => {
	const client = net.createConnection({ host: options.ip, port: options.port }, () => {
		client.write(str);
		client.end();
		client.on("close", () => {
			console.log("关闭成功");
		});
	});
};