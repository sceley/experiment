const moment = require('moment');
const db = require('../../model/db');
const addTask = require('../../common/task').addTask;
const cancelTask = require('../../common/task').cancelTask;
exports.addReserve = async (req, res) => {
    try {
        const account = req.session.user.account;
        const body = req.body;
        const hour = new Date().getHours();
        const createAt = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
        const date = moment().format("YYYY-MM-DD");
        if (!body.date) {
            return res.json({
                err: 1,
                msg: '请选择日期'
            });
        }
        if (!(body.start && body.end && body.start < body.end)) {
            return res.json({
                err: 1,
                msg: '请选择合适的时间段'
            });
        }
        if (body.date == date && body.start < hour) {
            return res.json({
                err: 1,
                msg: '请选择合适的时间段'
            });
        }
        if (!body.exp) {
            return res.json({
                err: 1,
                msg: '请选择实验室'
            });
        }
        if (!body.tab) {
            return res.json({
                err: 1,
                msg: '请选择位置'
            });
        }
        const reservesCount = await new Promise((resolve, reject) => {
            const sql = 'select count(*) as count from Reserve where exp_id=? and seat=? and date=? and ((start<? and start>=?) or (end<=? and end>?) or (start=? and end=?))';
            db.connection.query(sql, [body.exp, body.tab, body.date, body.end, body.start, body.end, body.start, body.start, body.end], (err, reserves) => {
                if (err)
                    reject(err);
                else
                    resolve(reserves[0].count);
            });
        });
        if (reservesCount > 0) {
            return res.json({
                err: 1,
                msg: '该时间段不能预约'
            });
        }
        const fault = await new Promise((resolve, reject) => {
            const sql = 'select fault from Tab where seat=? and exp_id=?';
            db.connection.query(sql, [body.tab, body.exp], (err, tabs) => {
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
        if (body.equipment) {
            await new Promise((resolve, reject) => {
                const sql = `insert into Reserve(user_id, exp_id, seat, start, 
                end, date, createAt, equipment, status) values(?, ?, ?, ?, ?, ?, ?, ?, ?)`;
                const values = [account, body.exp, body.tab, body.start, body.end, body.date, createAt, body.equipment, 0];
                db.connection.query(sql, values, err => {
                    if (err)
                        reject(err);
                    else 
                        resolve();
                });
            });
        } else {
            await new Promise((resolve, reject) => {
                const sql = `insert into Reserve(user_id, exp_id, seat, start,
                end, date, createAt, status) values(?, ?, ?, ?, ?, ?, ?, ?)`;
                const values = [account, body.exp, body.tab, body.start, body.end, body.date, createAt, 1];
                db.connection.query(sql, values, err => {
                    if (err)
                        reject(err);
                    else 
                        resolve();
                });
            });
            const reserve = await new Promise((resolve, reject) => {
                const sql = `select id, date, start, end from Reserve 
                where exp_id=? and seat=? and date=? and start=? and end=?`;
                const values = [body.exp, body.tab, body.date, body.start, body.end];
                db.connection.query(sql, values, (err, reserves) => {
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
        const account = req.session.user.account;
        let status = req.query.status;
        if (status == undefined) {
            status = '(0, 1, 2, 3)';
        } else {
            status = `(${status})`;
        }
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
                        where user_id=? and status in ${status} order by Reserve.createAt desc`;
            db.connection.query(sql, [account], (err, reserves) => {
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
            db.connection.query(sql, [status], (err, reserves) => {
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
    try {
        const id = req.params.id;
		await new Promise((resolve, reject) => {
			const sql = 'delete from Reserve where id=?';
			db.connection.query(sql, [id], err => {
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
    try {
        const body = req.body;
        const approver = req.session.admin.name;
        await new Promise((resolve, reject) => {
            const sql = 'update Reserve set status=?, approver=? where id=?';
            db.connection.query(sql, [body.status, approver, body.id], (err) => {
                if (err)
                    reject(err);
                else 
                    resolve();
            });
        });
        const reserve = await new Promise((resolve, reject) => {
            const sql = 'select id, start, date, end from Reserve where id=?';
            db.connection.query(sql, [body.id], (err, reserves) => {
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
    } catch (e) {
        res.json({
            err: 1,
            msg: '服务器出错了'
        });
    }
};