const db = require('../model/db');
const net = require('net');
//let data = "NUM1234EXP12TAB10ID16051223POW1DOR1FAU1";

exports.handleResponse = async str => {
    let res = convert_to_obj(str);
    await new Promise((resolve, reject) => {
        let sql = 'update Tab set status=? where seat=? and exp_id=?';
        db.query(sql, [parseInt(res.POW), parseInt(res.TAB), parseInt(res.EXP)], err => {
            if (err)
                reject(err);
            else
                resolve();
        });
    });
    if (parseInt(res.POW)) {
        await new Promise((resolve, reject) => {
            let sql = 'update Reserve set status=? where id=?';
            db.query(sql, [2, parseInt(res.NUM)], err => {
                if (err)
                    reject();
                else
                    resolve();
            });
        });
    } else {
        await new Promise((resolve, reject) => {
            let sql = 'update Reserve set status=? where id=?';
            db.query(sql, [3, parseInt(res.NUM)], err => {
                if (err)
                    reject();
                else
                    resolve();
            });
        });
    }
};

exports.execTask = async (task) => {
    let reserve = await new Promise((resolve, reject) => {
        let sql = 'select id as NUM, exp_id as EXP, seat as TAB, user_id as ID from Reserve where id=?';
        db.query(sql, [task.id], (err, reserves) => {
            if (err)
                reject(err);
            else
                resolve(reserves[0]);
        });
    });
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
    let str = convert_to_str(reserve);
    send(str, exp);
};

function convert_to_str (option) {
    if (!option)
        return;
    while (option.NUM.length !== 4) {
        option.NUM = '0' + option.NUM;
    }
    while (option.EXP.length !== 2) {
        option.EXP = '0' + option.EXP;
    }
    while (option.TAB.length !== 2) {
        option.TAB = '0' + option.TAB;
    }
    let str = '';
    for (let key in option) {
        str += `${key}${option[key]}`;
    }
    return str;
};
function convert_to_obj (str) {
    let obj = {};
    let pattern = /(NUM)(\d{4})(EXP)(\d{2})(TAB)(\d{2})(ID)(\d{8})(POW)(\d{1})(FAU)(\d{1})/;
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
        let count = 0;
        client.write(str);
        client.on('data', data => {
            if (data.toString() == 'SUC') {
                clearInterval(timer);
                client.end();
            }
        });
        let timer = setInterval(() => {
            client.write(str);
            count++;
            if (count == 10) {
                clearInterval(timer);
            }
        }, 1000);
    });
};