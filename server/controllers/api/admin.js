const db = require('../../model/db');
const config = require('../../config');
const sign = require('../../common/sign').sign;
exports.login = async (req, res) => {
	try {
		const body = req.body;
		const admin = await new Promise((resolve, reject) => {
			const sql = 'select name from Admin where account=? and password=?';
			db.query(sql, [body.account, body.password], (err, admins) => {
				if (err)
					reject(err);
				else
					resolve(admins[0]);
			});
		});
		if (admin) {
			const token = await sign('name', admin.name);
			res.json({
				token,
				msg: '登陆成功'
			});
		} else {
			res.json({
				err: 1,
				msg: '帐号不存在或密码错误'
			});
		}
	} catch (e) {
		res.json({
			err: 1,
			msg: '服务器出错了'
		});
	}
};