const express = require('express');
const http = require('http');
const config = require('./config');
const router = require('./router');

let app = express();
let server = http.createServer(app);

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Content-Length');
	res.setHeader('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE');
	next();
});
app.use(router);

server.on('connection', socket => {
	socket.on('data', data => {
		console.log(data.toString());
	});
});

server.listen(config.server.port, () => {
	console.log(`server run at ://localhost:${config.server.port}`);
});