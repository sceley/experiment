const db = require('../model/db');
const send = require('../controllers/tcp/socket').send;
//let data = "NUM1234EXP12TAB10ID16051223POW1DOR1FAU1";

exports.handleResponse = async (str) => {
    let res = convert_to_obj(str);
    await new Promise((resolve, reject) => {
        let sql = 'update Experiment set door=? where id=?';
        db.query(sql, [parseInt(res.DOR), parseInt(res.EXP)], err => {
            if (err)
            reject(err);
            else
            resolve();
        });
    });
    await new Promise((resolve, reject) => {
        let sql = 'update Tab set power_status=? where seat=? and exp_id=?';
        db.query(sql, [parseInt(res.POW), parseInt(res.TAB), parseInt(res.EXP)], err => {
            if (err)
            reject(err);
            else
            resolve();
        });
    });
    await new Promise((resolve, reject) => {
        let sql = 'update Reserve set complete_status=? where id=?';
        db.query(sql, [1, parseInt(res.NUM)], err => {
            if (err)
            reject();
            else
            resolve();
        });
    });
};

exports.execTask = async (id) => {
    try {
        let reserve = await new Promise((resolve, reject) => {
            let sql = 'select id as NUM, exp_id as EXP, user_id as ID, seat as TAB where id=?';
            db.query(sql, [id], (err, reserves) => {
                if (err)
                reject(err);
                else
                resolve(reserves[0]);
            });
        });
        let str = convert_to_str(reserve);
        send(str);
    } catch (e) {
        console.log(e);
    }
};

function convert_to_str (option) {
    while (option.NUM.length !== 4) {
        option.NUM = '0' + option.NUM;
    }
    while (option.EXP.length !== 2) {
        option.EXP = '0' + option.EXP;
    }
    while (option.TAB.length !== 2) {
        option.TAB = '0' + option.TAB;
    }
    option.POW = 1;
    option.DOR = 1;
    option.FAU = 1;
    let str = '';
    for (let key in obj) {
        str += `${key}${obj[key]}`;
    }
    return str;
};
function convert_to_obj (str) {
    let obj = {};
    let pattern = /(NUM)(\d{4})(EXP)(\d{2})(TAB)(\d{2})(ID)(\d{8})(POW)(\d{1})(DOR)(\d{1})(FAU)(\d{1})/;
    str.replace(pattern, (match, ...code) => {
        let arr = code.slice(0, -2);
        for (let i = 0; i < arr.length; i = i + 2) {
            obj[arr[i]] = arr[i + 1];
        }
    });
    return obj;
};