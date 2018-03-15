let fn = async socket => {
	try {
		// let res = await new Promise((resolve, reject) => {
		// 	socket.on('data', data => {
		// 		let obj = splitData(data.toString());
		// 		resolve(obj);
		// 	});
		// });
		console.log(socket.remoteAddress);
	} catch (e) {
		console.log(e);
	}
};
const net = require('net');
const server = net.createServer(fn);
server.listen(8081, "localhost", () => {
    console.log('server bound');
});