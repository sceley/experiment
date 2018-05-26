const db = require('./model/db');
const redis = require('./model/redis');
const config = require('./config');
const adminInitial = async () => {
    try {
        const count = await new Promise((resolve, reject) => {
            const sql = 'select count(*) as count from Admin';
            db.query(sql, (err, admins) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(admins[0].count);
                }
            });
        });
        if (count > 0)
            return;
        await new Promise((resolve, reject) => {
            const sql = 'insert into Admin(account, password, name) values(?, ?, ?)';
            db.query(sql, [config.admin.user, config.admin.pass, config.admin.name], err => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    } catch (e) {
        console.log(e);
    }
};

const redisInitial = async () => {
    try {
        const tasks_str = await new Promise((resolve, reject) => {
            client.get('tasks', (err, tasks_str) => {
                if (err)
                    reject(err);
                else
                    resolve(tasks_str);
            });
        });
        if (!tasks_str) {
            await new Promise((resolve, reject) => {
                const arr = [];
                const str = JSON.stringify(arr);
                client.set('tasks', str, err => {
                    if (err)
                        reject(err);
                    else
                        resolve();
                });
            });
        }
    } catch (e) {
        console.log(e);
    }
};

module.exports.initial = async () => {
    adminInitial();
    redisInitial();
};