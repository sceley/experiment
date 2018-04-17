const db = require('../../model/db');
const moment = require('moment');
exports.notify = async (req, res) => {
    try {
        const body = req.body;
        const createAt = moment().format("YYYY-MM-DD HH:MM");
        const author = req.admin_session.admin;
        await new Promise((resolve, reject) => {
            const sql = 'insert into Notification(msg, createAt, title, author) values(?, ?, ?)';
            db.query(sql, [body.Notification, createAt, body.Title, author], err => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
        res.json({
            err: 0,
            msg: '消息发布成功'
        });
    } catch (e) {
        res.json({
            err: 1,
            msg: '服务器出错了'
        });
    }
};
exports.notifications = async (req, res) => {
    try {
        let notifications = await new Promise((resolve, reject) => {
            let sql = "select id, title from Notification";
            db.query(sql, (err, notifications) => {
                if (err) 
                    reject(err);
                else 
                    resolve(notifications);
            });
        });
        res.json({
            err: 0,
            notifications
        });
    } catch (e) {
        res.json({
            err: 1,
            msg: '服务器出错了'
        });
    }
};
exports.deleteNotification = async (req, res) => {
    try {
        let id = req.params.id;
        await new Promise((resolve, reject) => {
            let sql = 'delete from Notification where id=?';
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
exports.notification = async (req, res) => {
    try {
        const id = req.params.id;
        console.log(id);
        const notification = await new Promise((resolve, reject) => {
            const sql = 'select * from Notification where id=?';
            db.query(sql, [id], (err, notification) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(notification);
                }
            });
        });
        res.json({
            err: 0,
            notification
        });
    } catch (e) {
        res.json({
            err: 1,
            msg: '服务器出错了'
        });
    }
};