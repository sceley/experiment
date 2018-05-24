const express = require('express');
// const https = require('https');
const http = require('http');
const net = require('net');
const fs = require('fs');
const config = require('./config');
const router = require('./router');
const socket = require('./controllers/tcp/socket').socket;
const initial = require('./initial').initial;

const app = express();
// const options = {
// 	key: fs.readFileSync("/etc/letsencrypt/live/zhilian.qinyongli.cn/privkey.pem"),
// 	cert: fs.readFileSync("/etc/letsencrypt/live/zhilian.qinyongli.cn/fullchain.pem")
// };
// const server = https.createServer(options, app);
const server = http.createServer(app);
const netServar = net.createServer();
initial();

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

process.on('uncaugthException', e => {
	console.log(e);
	process.exit(1);
});