const moment = require('moment');
const redis = require('../model/redis');
const db = require('../model/db');
const send = require('../controllers/tcp/socket').send;
const convert_to_str = require('./convert').convert_to_str;
let timer;
exports.addTask = async (option) => {
    clearTimeout(timer);
    let tasks_str = await new Promise((resolve, reject) => {
        redis.get('tasks', (err, res) => {
            if (err) 
                reject(err);
            else
                resolve(res);
        });
    });
    let tasks = JSON.parse(tasks_str);
    let current_str = await new Promise((resolve, reject) => {
        redis.get('current_task', (err, res) => {
            if (err)
                reject(err);
            else
                resolve(res);
        });
    });
    if (current_str) {
        let current_task = JSON.parse(current_str);
        tasks.push(current_task);
    }
    tasks.push(option);
    tasks = tasks.sort((pretask, nexttask) => {
        let a = moment(pretask.date).add(pretask.hours, 'h').valueOf();
        let b = moment(nexttask.date).add(nexttask.hours, 'h').valueOf();
        return a - b;
    });
    let task = tasks.shift();
    await new Promise((resolve, reject) => {
        let str = JSON.stringify(tasks);
        redis.set('tasks', str, err => {
            if (err) 
                reject(err);
            else
                resolve();
        });
    });
    if (!task) {
        await new Promise((resolve, reject) => {
            redis.del("current_task", err => {
                if (err)
                    reject(err);
                else
                    resolve();
            });
        });
    } else {
        await new Promise((resolve, reject) => {
            let str = JSON.stringify(task);
            redis.set("current_task", str, err => {
                if (err)
                    reject(err);
                else
                    resolve();
            });
        });
        let time = moment(task.date).add(task.hours, 'h').diff(moment(), 'milliseconds');
        exec_timer_task(time, task);
    }
};

exports.cancelTask = async (id) => {
    clearTimeout(timer);
    let tasks_str = await new Promise((resolve, reject) => {
        redis.get('tasks', (err, res) => {
            if (err)
                reject(err);
            else
                resolve(res);
        });
    });
    let tasks = JSON.parse(tasks_str);
    let current_str = await new Promise((resolve, reject) => {
        redis.get('current_task', (err, res) => {
            if (err)
                reject(err);
            else
                resolve(res);
        });
    });
    if (current_str) {
        let current_task = JSON.parse(current_str);
        tasks.unshift(current_task);
    }
    tasks = tasks.filter(task => {
        return task.id != id;
    });
    let task = tasks.shift();
    await new Promise((resolve, reject) => {
        let str = JSON.stringify(tasks);
        redis.set('tasks', str, err => {
            if (err)
                reject(err);
            else
                resolve();
        });
    });
    if (!task) {
        await new Promise((resolve, reject) => {
            redis.del("current_task", err => {
                if (err)
                    reject(err);
                else
                    resolve();
            });
        });
    } else {
        await new Promise((resolve, reject) => {
            let str = JSON.stringify(task);
            redis.set("current_task", str, err => {
                if (err)
                    reject(err);
                else
                    resolve();
            });
        });
        let time = moment(task.date).add(task.hours, 'h').diff(moment(), 'milliseconds');
        exec_timer_task(time, task);
    }
};

exports.initialTask = async () => {
    let tasks_str = await new Promise((resolve, reject) => {
        redis.get('tasks', (err, res) => {
            if (err)
                reject(err);
            else
                resolve(res);
        });
    });
    let tasks = JSON.parse(tasks_str);
    let current_str = await new Promise((resolve, reject) => {
        redis.get('current_task', (err, res) => {
            if (err)
                reject(err);
            else
                resolve(res);
        });
    });
    if (current_str) {
        let current_task = JSON.parse(current_str);
        tasks.unshift(current_task);
    }
    let task = tasks.shift();
    await new Promise((resolve, reject) => {
        let str = JSON.stringify(tasks);
        redis.set('tasks', str, err => {
            if (err)
                reject();
            else
                resolve();
        });
    });
    if (!task) {
        await new Promise((resolve, reject) => {
            redis.del('current_task', err => {
                if (err)
                    reject(err);
                else
                    resolve();
            });
        });
    } else {
        await new Promise((resolve, reject) => {
            let str = JSON.stringify(task);
            redis.set("current_task", str, err => {
                if (err)
                    reject(err);
                else
                    resolve();
            });
        });
        let time = moment(task.date).add(task.hours, 'h').diff(moment(), 'milliseconds');
        exec_timer_task(time, task);
    }
};

async function nextTask () {
    clearTimeout(timer);
    let tasks_str = await new Promise((resolve, reject) => {
        redis.get('tasks', (err, res) => {
            if (err)
                reject(err);
            else
                resolve(res);
        });
    });
    let tasks = JSON.parse(tasks_str);
    let task = tasks.shift();
    await new Promise((resolve, reject) => {
        let str = JSON.stringify(tasks);
        redis.set('tasks', str, err => {
            if (err)
            reject();
            else
            resolve();
        });
    });
    if (!task) {
        await new Promise((resolve, reject) => {
            redis.del('current_task', err => {
                if (err)
                    reject(err);
                else
                    resolve();
            });
        });
    } else {
        await new Promise((resolve, reject) => {
            let str = JSON.stringify(task);
            redis.set("current_task", str, err => {
                if (err)
                    reject(err);
                else
                    resolve();
            });
        });
        let time = moment(task.date).add(task.hours, 'h').diff(moment(), 'milliseconds');
        exec_timer_task(time, task);
    }
};

async function exec_timer_task(time, task) {
    timer = setTimeout(async () => {
        await execTask(task);
        await nextTask();
    }, time);
};

async function execTask(task) {
    try {
        const reserve = await new Promise((resolve, reject) => {
            const sql = 'select id as NUM, exp_id as EXP, seat as TAB, user_id as account from Reserve where id=?';
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
        if (reserve instanceof Object) {
            const str = convert_to_str(reserve);
            send(str);
        }
    } catch (e) {
        console.log(e);
    }
};