const db = require('../../model/db');
const moment = require('moment');
exports.expdatastatics = async (req, res) => {
    try {
        const exp_statistics = await new Promise((resolve, reject) => {
            const sql = `select count(Reserve.id) as count, name from Reserve 
                        left join Experiment
                        on Reserve.exp_id=Experiment.id
                        group by name`;
            db.query(sql, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
        const reserves = await new Promise((resolve, reject) => {
            const sql = `select end, start from Reserve`;
            db.query(sql, (err, reserves) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(reserves);
                }
            });
        });
        const morning = {
            time: '上午',//(8-11)
            count: 0
        };
        const noon = {
            time: '中午',//(11-13)
            count: 0
        };
        const afternoon = {
            time: '下午',//(13-18)
            count: 0
        };
        const evening = {
            time: '晚上',//(18-22)
            count: 0
        };
        reserves.forEach(reserve => {
            const mid = (reserve.start + reserve.end) / 2;
            if (mid >= 8 && mid < 11) {
                morning.count++;
            } else if (mid >= 11 && mid < 13) {
                noon.count++;
            } else if (mid >= 13 && mid < 18) {
                afternoon.count++;
            } else if (mid >= 18 && mid < 22) {
                evening.count++;
            }
        });
        const time_statistics = {
            morning,
            noon,
            afternoon,
            evening
        };
        const today = moment().format('YYYY-MM-DD');
        const lastweekday = moment().add(-7, 'd').format('YYYY-MM-DD');
        let weekdatas = await new Promise((resolve, reject) => {
            const sql = `select sum(end - start) as hours, date from Reserve group by date`;
            db.query(sql, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
        weekdatas = weekdatas.filter(weekdata => {
            const date = moment(weekdata.date).format('YYYY-MM-DD');
            return (date <= today && date > lastweekday);
        });
        res.json({
            err: 0,
            exp_statistics,
            time_statistics,
            weekdatas
        });
    } catch (e) {
        console.log(e);
        res.json({
            err: 1,
            msg: '服务器出错了'
        });
    }
};