const moment = require('moment');
const db = require('../../model/db');
exports.addReserve = async (req, res) => {
    console.log(req.session);
    let id = req.session.uid;
    let body = req.body;
    let createAt = moment(new Date()).format('YYYY-MM-DD HH:MM:SS');
    console.log(createAt);
    try {
        if (body.Equipment)
            await new Promise((resolve, reject) => {
                let sql = 'insert into Reserve(user_id, exp_id, table_id, createAt, equipment) values(?, ?, ?, ?, ?)';
                db.query(sql, [id, body.Location[0], body.Location[1], createAt, body.Equipment], err => {
                    if (err)
                        reject(err);
                    else 
                        resolve();
                });
            });
        else
            await new Promise((resolve, reject) => {
                let sql = 'insert into Reserve(user_id, exp_id, table_id, createAt, pass) values(?, ?, ?, ?, ?)';
                db.query(sql, [id, body.Location[0], body.Location[1], createAt, 1], err => {
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
    let id = req.session.uid;
    try {
        let reserves = await new Promise((resolve, reject) => {
            let sql = `select exp_id, table_id, createAt, Reserve.id, equipment,  
            address, pass from Reserve left join Experiment 
            on Reserve.exp_id=Experiment.id where user_id=?`;
            db.query(sql, [id], (err, reserves) => {
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