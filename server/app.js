const express = require('express');
const http = require('http');
const net = require('net');
const config = require('./config');
const router = require('./router');
const socket = require('./controllers/tcp/socket');

let app = express();
let server = http.createServer(app);
let netServar = net.createServer();

netServar.on("connection", socket);

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Content-Length, x-access-token');
	res.setHeader('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTION');
	next();
});
app.use(router);

server.listen(config.server.port, () => {
	console.log(`server run at ://localhost:${config.server.port}`);
});
netServar.listen(config.netServer.port, () => {
	console.log(`netServar run at port=>${config.netServer.port}`);
});