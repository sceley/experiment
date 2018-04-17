const db = require('../model/db');
const net = require('net');
const moment = require('moment');
exports.handleResponse = async str => {
    try {
        if (str.length == 15) {
            const account = str.slice(3, 11);
            const id = str.slice(13);
            await new Promise((resolve, reject) => {
                const sql = 'insert into ID(account, id) values(?, ?)';
                db.query(sql, [account, id], err => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            });
            await new Promise((resolve, reject) => {
                const sql = 'update User set id=? where account=?';
                db.query(sql, [id, account], err => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            });
        } else {
            const res = convert_to_obj(str);
            const time = moment().format('YYYY-MM-DD HH:mm:ss');
            await new Promise((resolve, reject) => {
                const sql = 'update Tab set status=?, fault=? where seat=? and exp_id=?';
                db.query(sql, [parseInt(res.POW), parseInt(res.FAU), parseInt(res.TAB), parseInt(res.EXP)], err => {
                    if (err)
                        reject(err);
                    else
                        resolve();
                });
            });
            if (parseInt(res.POW)) {
                await new Promise((resolve, reject) => {
                    const sql = 'update Reserve set status=?, go_into_time=? where id=?';
                    db.query(sql, [2, time, parseInt(res.NUM)], err => {
                        if (err)
                            reject();
                        else
                            resolve();
                    });
                });
            } else {
                await new Promise((resolve, reject) => {
                    const sql = 'update Reserve set status=?, leave_time=? where id=?';
                    db.query(sql, [3, time, parseInt(res.NUM)], err => {
                        if (err)
                            reject();
                        else
                            resolve();
                    });
                });
            }
        }
    } catch (e) {
        console.log(e);
    }
};

exports.execTask = async (task) => {
    try {
        let reserve = await new Promise((resolve, reject) => {
            let sql = 'select id as NUM, exp_id as EXP, seat as TAB, user_id as account from Reserve where id=?';
            db.query(sql, [task.id], (err, reserves) => {
                if (err)
                    reject(err);
                else
                    resolve(reserves[0]);
            });
        });
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
        reserve.POW = task.pow;
        let exp = await new Promise((resolve, reject) => {
            let sql = 'select ip, port from Experiment where id=?';
            db.query(sql, [reserve.EXP], (err, exps) => {
                if (err)
                    reject(err);
                else
                    resolve(exps[0]);
            });
        });
        if (reserve instanceof Object) {
            let str = convert_to_str(reserve);
            send(str, exp);
        }
    } catch (e) {
        console.log(e);
    }
};

function convert_to_str (option) {
    for (const key in option) {
        option[key] = String(option[key]);
    }
    while (option.NUM.length !== 4) {
        option.NUM = '0' + option.NUM;
        if (option.NUM.length > 4) {
            break;
        }
    }
    while (option.EXP.length !== 2) {
        option.EXP = '0' + option.EXP;
        if (option.EXP.length > 2) {
            break;
        }
    }
    while (option.TAB.length !== 2) {
        option.TAB = '0' + option.TAB;
        if (option.TAB.length > 2) {
            break;
        }
    }
    while (option.ID.length !== 2) {
        option.ID = '0' + option.ID;
        if (option.ID.length > 2) {
            break;
        }
    }
    let str = '';
    for (let key in option) {
        str += `${key}${option[key]}`;
    }
    return str;
};
function convert_to_obj (str) {
    let obj = {};
    let pattern = /(NUM)(\d{4})(EXP)(\d{2})(TAB)(\d{2})(ID)(\d{2})(POW)(\d{1})(FAU)(\d{1})/;
    str.replace(pattern, (match, ...code) => {
        let arr = code.slice(0, -2);
        for (let i = 0; i < arr.length; i = i + 2) {
            obj[arr[i]] = arr[i + 1];
        }
    });
    return obj;
};
async function send (str, options) {
    const client = net.createConnection({ host: options.ip, port: options.port }, () => {
        client.write(str);
        client.end();
        console.log("数据发送成功");
    });
    client.on('error', err => {
        console.log('发生错误', err);
    });
    client.on('close', () => {
        console.log('关闭成功');
    });
};