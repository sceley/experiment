const moment = require('moment');
const db = require('../../model/db');
const send = require('../tcp/socket').send;
exports.addReserve = async (req, res) => {
    let id = req.user_session.uid;
    let body = req.body;
    let hour = new Date().getHours();
    let createAt = moment(new Date()).format('YYYY-MM-DD');
    if (!body.Date) {
        return res.json({
            err: 1,
            msg: '请选择日期'
        });
    }
    if (!(body.Start && body.End && body.Start > body.End && body.Start >= hour)) {
        return res.json({
            err: 1,
            msg: '请选择合适的时间段'
        });
    }
    if (!body.Exp) {
        return res.json({
            err: 1,
            msg: '请选择实验室'
        });
    }
    if (!body.Tab) {
        return res.json({
            err: 1,
            msg: '请选择位置'
        });
    }
    try {
        let reserves_count = await new Promise((resolve, reject) => {
            let sql = 'select count(id) as count from Reserve where exp_id=? and table_id=? and date=? and ((start<? and start>=?) or (end<=? and end>?) or (start=? and end=?))';
            db.query(sql, [body.Exp, body.Tab, body.Date, body.End, body.Start, body.End, body.Start, body.Start, body.End], (err, reserves) => {
                if (err)
                    reject(err);
                else
                    resolve(reserves[0].count);
            });
        });
        if (reserves_count > 0) {
            return res.json({
                err: 1,
                msg: '该时间段不能预约'
            });
        }
        if (body.Equipment) {
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
        } else {
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
            let reserve_id = await new Promise((resolve, reject) => {
                let sql = `select id from Reserve where exp_id=? and table_id=? 
                and date=? and start=? and end=?`;
                db.query(sql, [body.Exp, body.Tab, body.Date, body.Start, body.End], (err, reserves) => {
                    if (err)
                        reject(err);
                    else
                        resolve(reserves[0].id);
                });
            });
            let school_number = await new Promise((resolve, reject) => {
                let sql = 'select account from User where id=?';
                db.query(sql, [id], (err, users) => {
                    if (err)
                        reject(err);
                    else
                        resolve(users[0].account);
                });
            });
            let exp = await new Promise((resolve, reject) => {
                let sql = 'select ip, port from Experiment where id=?';
                db.query(sql, [body.Exp], (err, exps) => {
                    if (err)
                        reject(err);
                    else
                        resolve(exps[0]);
                });
            });
            body.reserve_id = reserve_id;
            body.id = school_number;
            body.port = exp.port;
            body.ip = exp.ip;
            send(body);
        }
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
            let sql = `select exp_id, table_id, Reserve.id, equipment, date, name,
            address, Reserve.status, start, end, approver from Reserve left join Experiment 
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
            address, Reserve.status, start, end, approver, name from Reserve left join Experiment 
            on Reserve.exp_id=Experiment.id`;
            db.query(sql, (err, reserves) => {
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
    let body = req.body;
    let approver = req.admin_session.admin;
    try {
        await new Promise((resolve, reject) => {
            let sql = 'update Reserve set status=?, approver=? where id=?';
            db.query(sql, [body.status, approver, body.id], (err) => {
                if (err)
                    reject(err);
                else 
                    resolve();
            });
        });
        res.json({
            err: 0,
            msg: '设置成功'
        });
    } catch (e) {
        res.json({
            err: 1,
            msg: '服务器出错了'
        });
    }
};