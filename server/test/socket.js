const net = require('net');
const client = net.connect({port: 8081, host: 'localhost'}, () => {
    client.write('NUM1234EXP12TAB10ID16051223POW1DOR1FAU1');
});
client.on('data', data => {
    console.log(data.toString());
    client.end();
});
client.on('end',(e) => {
	console.log(e);
    console.log('client disconnected');
});
