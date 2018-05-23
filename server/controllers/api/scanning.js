const db = require('../../model/db');
const send = require('../tcp/socket').send;
const convert_to_str = require('../../common/handlesocket').convert_to_str;
exports.scanningOpen = async (req, res) => {
    try {
        const account = req.session.user.account;
        const hour = ( new Date() ).getHours();
        const reserve = await new Promise((resolve, reject) => {
            const sql = 'select id as NUM, exp_id as EXP, seat as TAB, user_id as account from Reserve where start<=? and end>? and user_id=?';
            db.query(sql, [hour, hour, account], (err, reserves) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(reserves[0]);
                }
            });
        });
        if (reserve) {
            reserve.ID = await new Promise((resolve, reject) => {
                const sql = 'select id from User where account=?';
                db.query(sql, [reserve.account], (err, users) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(users[0].id);
                    }
                });
            });
            delete reserve.account;
            reserve.POW = 2;
            const str = convert_to_str(reserve);
            send(str);
            res.json({
                err: 0,
                msg: '打开成功'
            });
        } else {
            res.json({
                err: 1,
                msg: '您没有该时段的预约'
            });
        }
    } catch (e) {
        console.log(e);
    }
};