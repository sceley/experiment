const db = require('../../model/db');
const moment = require('moment');
exports.notify = async (req, res) => {
    let body = req.body;
    let createAt = moment().format("YYYY-MM-DD");
    try {
        await new Promise((resolve, reject) => {
            let sql = 'insert into Notification(msg, createAt, title) values(?, ?, ?)';
            db.query(sql, [body.Notification, createAt, body.Title], err => {
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
            let sql = "select * from Notification";
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
    let id = req.params.id;
    try {
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