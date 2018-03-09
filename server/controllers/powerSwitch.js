const request = require('superagent');
exports.powerSwitch = async(req, res) => {
	try {
		let re = await new Promise((resolve, reject) => {
			request
				.post('http://localhost:8080/api')
				.send(req.query) // sends a JSON post body
				.set('X-API-Key', 'foobar')
				.set('accept', 'json')
				.end((err, res) => {
					if (!err) {
						resolve(res);
					} else {
						reject(err);
					}
				});
		});
		res.send(re.text);

	} catch (e) {
		res.json({
			err: 1
		});
	}
};
exports.api = async(req, res) => {
	res.send("Hwlloworld");
};