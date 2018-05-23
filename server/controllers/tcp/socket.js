const net = require('net');
const db = require('../../model/db');
const handleResponse = require("../../common/handlesocket").handleResponse;
let sockets  = [];
exports.socket = async socket => {
	sockets.push(socket);
	socket.on('data', res => {
		return console.log(res.toString());
		handleResponse(res.toString());
	});
	socket.on('end', () => {
		const tmp = [];
		for (let i = 0; i < sockets.length; i++) {
			if (sockets[i] != socket) {
				tmp.push(socket[i]);
			}
		}
		sockets = tmp;
	});
};
exports.send = async (str) => {
	for (let i = 0; i < sockets.length; i++) {
		sockets[i].write(str);
	}
};