const moment = require('moment');
const db = require('../../model/db');
const addTask = require('../../common/task').addTask;
const cancelTask = require('../../common/task').cancelTask;
exports.addReserve = async (req, res) => {
    try {
        let account = req.user_session.account;
        let body = req.body;
        let hour = new Date().getHours();
        let createAt = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
        let _date = moment().format("YYYY-MM-DD");
        //dsd
        const starts = body.Start.split(':');
        const ends = body.End.split(':');
        body.Start = parseInt(starts[0]);
        body.End = parseInt(ends[0]);
        if (starts[1]) {
            let start_min_to_hour = starts[1] / 60;
            // start_min_to_hour = Math.round(start_min_to_hour * 100) / 100;
            body.Start += start_min_to_hour;
        }
        if (ends[1]) {
            let end_min_to_hour = ends[1] / 60;
            // end_min_to_hour = Math.round(end_min_to_hour * 100) / 100;
            body.End += end_min_to_hour;
        }
        //dsd
        if (!body.Date) {
            return res.json({
                err: 1,
                msg: '请选择日期'
            });
        }
        if (!(body.Start && body.End && body.Start < body.End)) {
            return res.json({
                err: 1,
                msg: '请选择合适的时间段'
            });
        }
        if (body.Date == _date && body.Start < hour) {
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
        let reserves_count = await new Promise((resolve, reject) => {
            let sql = 'select count(id) as count from Reserve where exp_id=? and seat=? and date=? and ((start<? and start>=?) or (end<=? and end>?) or (start=? and end=?))';
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
        let fault = await new Promise((resolve, reject) => {
            let sql = 'select fault from Tab where seat=? and exp_id=?';
            db.query(sql, [body.Tab, body.Exp], (err, tabs) => {
                if (err)
                    reject(err);
                else
                    resolve(tabs[0].fault);
            });
        });
        if (fault) {
            return res.json({
                err: 1,
                msg: '该位置出故障了，不能使用'
            });
        }
        if (body.Equipment) {
            await new Promise((resolve, reject) => {
                let sql = `insert into Reserve(user_id, exp_id, seat, start, 
                end, date, createAt, equipment, status) values(?, ?, ?, ?, ?, ?, ?, ?, ?)`;
                db.query(sql, [account, body.Exp, body.Tab, body.Start, body.End, body.Date, createAt, body.Equipment, 0], err => {
                    if (err)
                        reject(err);
                    else 
                        resolve();
                });
            });
        } else {
            await new Promise((resolve, reject) => {
                let sql = `insert into Reserve(user_id, exp_id, seat, start,
                end, date, createAt, status) values(?, ?, ?, ?, ?, ?, ?, ?)`;
                db.query(sql, [account, body.Exp, body.Tab, body.Start, body.End, body.Date, createAt, 1], err => {
                    if (err)
                        reject(err);
                    else 
                        resolve();
                });
            });
            let reserve = await new Promise((resolve, reject) => {
                let sql = `select id, date, start, end from Reserve where exp_id=? and seat=? and date=? and start=? and end=?`;
                db.query(sql, [body.Exp, body.Tab, body.Date, body.Start, body.End], (err, reserves) => {
                    if (err)
                        reject(err);
                    else
                        resolve(reserves[0]);
                });
            });
            await addTask({
                id: reserve.id,
                date: reserve.date,
                hours: reserve.start,
                pow: 1
            });
            await addTask({
                id: reserve.id,
                date: reserve.date,
                hours: reserve.end,
                pow: 0
            });
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

exports.getUserReserves = async (req, res) => {
    try {
        const account = req.user_session.account;
        const status = req.query.status;
        const reserves = await new Promise((resolve, reject) => {
            const sql = `select Reserve.id, User.name as user_name, date, start, end, 
                        Experiment.name as exp_name, 
                        seat, address, equipment, approver, Reserve.status,
                        go_into_time, leave_time
                        from Reserve 
                        left join Experiment 
                        on Reserve.exp_id=Experiment.id 
                        left join User
                        on Reserve.user_id=User.account
                        where user_id=? and status=? order by Reserve.createAt desc`;
            db.query(sql, [account, status], (err, reserves) => {
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

exports.getReserves = async (req, res) => {
    try {
        const status = req.query.status;
        const reserves = await new Promise((resolve, reject) => {
            const sql = `select Reserve.id, User.name as user_name, date, start, end, 
                        Experiment.name as exp_name, 
                        seat, address, equipment, approver, Reserve.status,
                        go_into_time, leave_time
                        from Reserve 
                        left join Experiment 
                        on Reserve.exp_id=Experiment.id 
                        left join User
                        on Reserve.user_id=User.account
                        where status=? order by Reserve.createAt desc`;
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
        await cancelTask(id);
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

exports.switchReserve = async (req, res) => {
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
        let reserve = await new Promise((resolve, reject) => {
            let sql = 'select id, start, date, end from Reserve where id=?';
            db.query(sql, [body.id], (err, reserves) => {
                if (err) 
                    reject(err);
                else
                    resolve(reserves[0]);
            });
        });
        await addTask({
            id: reserve.id,
            date: reserve.date,
            hours: reserve.start,
            pow: 1
        });
        await addTask({
            id: reserve.id,
            date: reserve.date,
            hours: reserve.end,
            pow: 0
        });
        res.json({
            err: 0,
            msg: '设置成功'
        });
        return;
    } catch (e) {
        res.json({
            err: 1,
            msg: '服务器出错了'
        });
    }
};