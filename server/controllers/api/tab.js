// const db = require('../../model/db');
// exports.switchPower = async (req, res) => {
//     let body = req.body;
//     try {
//         await new Promise((resolve, reject) => {
//             let sql = 'update Tab set power_status=? where id=?';
//             db.query(sql, [body.power, body.id], err => {
//                 if (err)
//                     reject(err);
//                 else
//                     resolve();
//             });
//         });
//         res.json({
//             err: 0,
//             msg: '开关使用成功'
//         });
//     } catch (e) {
//         res.json({
//             err: 1,
//             msg: '服务器出错了'
//         });
//     }
// };