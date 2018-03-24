const moment = require('moment');
const db = require('../../model/db');
exports.addReserve = async (req, res) => {
    let id = req.user_session.uid;
    let body = req.body;
    let createAt = moment(new Date()).format('YYYY-MM-DD');
    try {
        if (body.Equipment)
            await new Promise((resolve, reject) => {
                let sql = `insert into Reserve(user_id, exp_id, table_id, start, 
                end, date, createAt, equipment) values(?, ?, ?, ?, ?, ?, ?, ?)`;
                db.query(sql, [id, body.Exp, body.Tab, body.Start, body.End, body.Date, createAt, body.Equipment], err => {
                    if (err)
                        reject(err);
                    else 
                        resolve();
                });
            });
        else
            await new Promise((resolve, reject) => {
                let sql = `insert into Reserve(user_id, exp_id, table_id, start,
                end, date, createAt, status) values(?, ?, ?, ?, ?, ?, ?, ?)`;
                db.query(sql, [id, body.Exp, body.Tab, body.Start, body.End, body.Date, createAt, 1], err => {
                    if (err)
                        reject(err);
                    else 
                        resolve();
                });
            });
        res.json({
            err: 0,
            msg: '预约成功'
        });
    } catch (e) {
        console.log(e);
        res.json({
            err: 1,
            msg: '服务器出错了'
        });
    }
};

exports.showOneReserves = async (req, res) => {
    let id = req.user_session.uid;
    let complete = req.query.complete;
    try {
        let reserves = await new Promise((resolve, reject) => {
            let sql = `select exp_id, table_id, Reserve.id, equipment, date,
            address, Reserve.status, start, end from Reserve left join Experiment 
            on Reserve.exp_id=Experiment.id where user_id=? and complete_status=?`;
            db.query(sql, [id, complete], (err, reserves) => {
                if (err)
                    reject(err);
                else
                    resolve(reserves);
            });
        });
        res.json({
            err: 0,
            reserves
        });
    } catch (e) {
        console.log(e);
        res.json({
            err: 1,
            msg: '服务器出错了'
        });
    }
};

exports.showReserves = async (req, res) => {
    let status = req.query.status;
    try {
        let reserves = await new Promise((resolve, reject) => {
            let sql = `select exp_id, table_id, createAt, Reserve.id, equipment,  
            address, status, start, end from Reserve left join Experiment 
            on Reserve.exp_id=Experiment.id where status=?`;
            db.query(sql, [status], (err, reserves) => {
                if (err)
                    reject(err);
                else
                    resolve(reserves);
            });
        });
        res.json({
            err: 0,
            reserves
        });
    } catch (e) {
        res.json({
            err: 1,
            msg: '服务器出错了'
        });
    }
};

exports.deleteReserve = async (req, res) => {
	let id = req.params.id;
	try {
		await new Promise((resolve, reject) => {
			let sql = 'delete from Reserve where id=?';
			db.query(sql, [id], err => {
				if (err)
					reject(err);
				else 
					resolve();
			});
        });
        res.json({
            err: 0,
            msg: '删除成功'
        });
	} catch (e) {
        res.json({
            err: 1,
            msg: '服务器出错了'
        });
	}
};

exports.monitorReserve = async (req, res) => {
    let id = req.params.id;
    try {
        let reserve = await new Promise((resolve, reject) => {
            let sql = 'select status from Reserve where id=?';
            db.query(sql, [id], (err, reserves) => {
                if (err) 
                    reject(err);
                else 
                    resolve(reserves[0]);
            });
        });
        console.log(reserve);
        await new Promise((resolve, reject) => {
            let sql = 'update Reserve set status=? where id=?';
            db.query(sql, [!reserve.status, id], (err) => {
                if (err)
                    reject(err);
                else 
                    resolve();
            });
        });
        res.json({
            err: 0,
            msg: 'success'
        });
    } catch (e) {
        console.log(e);
        res.json({
            err: 1,
            msg: '服务器出错了'
        });
    }
};