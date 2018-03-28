const db = require('../model/db');
exports.spliceData = async (body, id) => {
    let NUM = await new Promise((resolve, reject) => {
        let sql = `select id from Reserve where exp_id=? and seat=? 
            and date=? and start=? and end=?`;
        db.query(sql, [body.Exp, body.Tab, body.Date, body.Start, body.End], (err, reserves) => {
            if (err)
                reject(err);
            else
                resolve(reserves[0].id);
        });
    });
    let data = {
        NUM: NUM,
        ID: id,
        TAB: body.Tab,
        EXP: body.Exp
    };
    return data;
};  