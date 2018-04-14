const db = require('../../model/db');
const moment = require('moment');
exports.rate = async (req, res) => {
    try {
        const body = req.body;
        const id = req.params.id;
        const createAt = moment().format('YYYY-MM-DD HH:mm:ss');
        if (!body.rate) {
            return res.json({
                err: 1,
                msg: '分不能为空'
            });
        }
        if (!body.message) {
            res.json({
                err: 1,
                msg: '内容不能为空'
            });
        }
        await new Promise((resolve, reject) => {
            const sql = 'insert into Rate(reserve_id, rate, message, createAt) values(?, ?, ?, ?)';
            db.query(sql, [id, body.rate, body.message, createAt], err => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
        res.json({
            err: 0,
            msg: '评分成功'
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
            res.json({
                err: 1,
                msg: '内容不能为空'
            });
        }
        await new Promise((resolve, reject) => {
            const sql = 'update Rate set reply=? where id=?';
            db.query(sql, [body.message, id], err => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    } catch (e) {
        res.json({
            err: 1,
            msg: '服务器出错了'
        });
    }
};