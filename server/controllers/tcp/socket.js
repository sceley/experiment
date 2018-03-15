// const db = require('../model/db');
module.exports = async socket => {
	try {
		let res = await new Promise((resolve, reject) => {
			socket.on('data', data => {
				let obj = splitData(data.toString());
				resolve(obj);
			});
		});
		console.log(res);
		console.log(socket.remoteAddress);
	} catch (e) {
		console.log(e);
	}
};

//let data = "NUM1234EXP12TAB10ID16051223POW1DOR1FAU1";
function splitData (str) {
	let obj = {};
	let pattern = /(NUM)(\d{4})(EXP)(\d{2})(TAB)(\d{2})(ID)(\d{8})(POW)(\d{1})(DOR)(\d{1})(FAU)(\d{1})/;
	str.replace(pattern, (match, ...code) => {
		let arr = code.slice(0, -2);
		for (let i = 0; i < arr.length; i = i + 2) {
			obj[arr[i]] = arr[i + 1];
		}
	});
	return obj;
};