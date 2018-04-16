const db = require('../../model/db');
const moment = require('moment');
const xlsx = require('xlsx');
const path = require('path');
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
        res.json({
            err: 1,
            msg: '服务器出错了'
        });
    }
};
exports.downloadReservations = async (req, res) => {
    try {
        let reservations = await new Promise((resolve, reject) => {
            const sql = `select User.name as A, date_format(date, '%Y-%m-%d') as B, start as C1, end as C2, 
                        Experiment.name as D, seat as E, address as F, equipment as G, 
                        approver as H, Reserve.status as I, date_format(go_into_time, '%Y-%m-%d') as J, 
                        date_format(leave_time, '%Y-%m-%d') as K
                        from Reserve 
                        left join Experiment 
                        on Reserve.exp_id=Experiment.id 
                        left join User
                        on Reserve.user_id=User.account where status=3
                        order by Reserve.createAt desc`;
            db.query(sql, (err, reserves) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(reserves);
                }
            });
        });
        reservations = reservations.map(reservation => {
            if (!reservation.G) {
                reservation.G = '无';
            }
            if (!reservation.H) {
                reservation.H = '无';
            }
            if (!reservation.J) {
                reservation.J = '暂无';
            }
            if (!reservation.K) {
                reservation.K = '暂无';
            }
            switch (reservation.I) {
                case 0:
                    reservation.I = '待审核'
                    break;
                case 1:
                    reservation.I = '已审核'
                    break;
                case 2:
                    reservation.I = '执行中'
                    break;
                case 3:
                    reservation.I = '已执行'
                    break;
            }
            return reservation;
        });
        const ref = { "!ref": `A1:K${reservations.length + 1}` };
        const data = {};
        for (let i = 1; i <= reservations.length; i++) {
            const start = Math.floor(reservations[i - 1].C1);
            const end = Math.ceil(reservations[i - 1].C2);
            reservations[i - 1][`C`] = `${start}-${end}`;
            delete reservations[i - 1].C2;
            delete reservations[i - 1].C1;
            for (const key in reservations[i - 1]) {
                const obj = {
                    v: reservations[i - 1][key]
                };
                data[`${key}${i+1}`] = obj;
            }
        }
        const header = {
            A1: { v: '用户名'},//user_name
            B1: { v: '预约日期'},
            D1: { v: '预约实验室'},
            C1: { v: '预约时间段'},
            E1: { v: '预约实验台'},
            F1: { v: '实验室地点'},
            G1: { v: '其他设备'},
            H1: { v: '审核人'},
            I1: { v: '状态'},
            J1: { v: '进入时间'},
            K1: { v: '离开时间'}
        };
        const values = Object.assign(header, data, ref);
        const wb = {
            SheetNames: ["Sheet1"],
            Sheets: {
                Sheet1: values
            }
        };
        const wopts = { bookType: 'xlsx', bookSST: false, type:'file' };
        xlsx.writeFile(wb, path.join(__dirname, '../../', 'public', 'output.xlsx'), wopts);
        res.download(path.join(__dirname, '../../', 'public', 'output.xlsx'));
    } catch (e) {
        res.json({
            err: 1,
            msg: '服务器出错了'
        });
    }
};