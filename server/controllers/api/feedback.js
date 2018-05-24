const db = require('../../model/db');
const moment = require('moment');
exports.feedback = async (req, res) => {
    try {
        const body = req.body;
        const account = req.session.user.account;
        const createAt = moment().format('YYYY-MM-DD HH:mm:ss');
        if (!body.message) {
            return res.json({
                err: 1,
                msg: '内容不能为空'
            });
        }
        const author = await new Promise((resolve, reject) => {
            const sql = 'select name from User where account=?';
            db.query(sql, [account], (err, users) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(users[0].name);
                }
            });
        });
        await new Promise((resolve, reject) => {
            const sql = 'insert into Feedback (author, message, createAt) values(?, ?, ?)';
            db.query(sql, [author, body.message, createAt], err => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
        res.json({
            err: 0,
            msg: '提交成功'
        });
    } catch (e) {
        res.json({
            err: 1,
            msg: '服务器出错了'
        });
    }
};
exports.reply = async (req, res) => {
    try {
        const body = req.body;
        const id = req.params.id;
        if (!body.message) {
            return res.json({
                err: 1,
                msg: '内容不能为空'
            });
        }
        await new Promise((resolve, reject) => {
            const sql = 'update Feedback set reply=?, replyable=false where id=?';
            db.query(sql, [body.message, id], err => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
        res.json({
            err: 0,
            msg: '回复成功'
        });
    } catch (e) {
        res.json({
            err: 1,
            msg: '服务器出错了'
        });
    }
};
exports.getFeedback = async (req, res) => {
    try {
        const feedbacks = await new Promise((resolve, reject) => {
            const sql = 'select * from Feedback';
            db.query(sql, (err, feedbacks) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(feedbacks);
                }
            });
        });
        res.json({
            err: 0,
            feedbacks
        });
    } catch (e) {
        res.json({
            err: 1,
            msg: '服务器出错了'
        });
    }
};
exports.getFeedbackReply = async (req, res) => {
    try {
        const account = req.session.user.account;
        const name = await new Promise((resolve, reject) => {
            const sql = 'select name from User where account=?';
            db.query(sql, [account], (err, users) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(users[0].name);
                }
            });
        });
        const replys = await new Promise((resolve, reject) => {
            const sql = 'select * from Feedback where replyable=false and author=?';
            db.query(sql, [name], (err, replys) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(replys);
                }
            });
        });
        res.json({
            err: 0,
            replys
        });
    } catch (e) {
        console.log(e);
        res.json({
            err: 1,
            msg: '服务器出错了'
        });
    }
};