const db = require('../model/db');
const moment = require('moment');
const reserve = {
    createAt: moment().format('YYYY-MM-DD HH:mm:ss'),
    date: '2018-04-02',
    start: 14,
    end: 16,
    go_into_time: moment().format('YYYY-MM-DD HH:mm:ss'),
    leave_time: moment().format('YYYY-MM-DD HH:mm:ss'),
    status: 3,
    user_id: '16051223',
    exp_id: 3,
    seat: 2
};
async function execute (params) {
    // const user_id = await new Promise((resolve, reject) => {
    //     const sql = 'select * from User';
    //     db.query(sql, (err, users) => {
    //         if (err) {
    //             reject(err);
    //         } else {
    //             resolve(users[0].account);
    //         }
    //     });
    // });
    await new Promise((resolve, reject) => {
        const sql = 'insert into Reserve (createAt, date, start, end, go_into_time, leave_time, status, user_id, exp_id, seat) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        db.query(sql, [reserve.createAt, reserve.date, reserve.start, reserve.end, reserve.go_into_time, reserve.leave_time, reserve.status, reserve.user_id, reserve.exp_id, reserve.seat], err => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
    console.log("插入成功");
};
execute();