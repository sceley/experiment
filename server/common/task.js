const moment = require('moment');
const redis = require('../model/redis');
const execTask = require('./handlesocket').execTask;

const timer = setInterval(async() => {
    const current_str = await new Promise((resolve, reject) => {
        redis.get('current_task', (err, res) => {
            if (err)
                reject(err);
            else
                resolve(res);
        });
    });
    if (current_str) {
        const current_task = JSON.parse(current_str);
        const time = moment(current_task.date).add(current_task.hours, 'h').diff(moment(), 'milliseconds');
        if (time <= 0) {
            await new Promise((resolve, reject) => {
                redis.del('current_task', (err, res) => {
                    if (err)
                        reject(err);
                    else
                        resolve(res);
                });
            });
            await execTask(current_task);
            await nextTask();
        } 
    }
}, 1000 * 10);

exports.addTask = async (option) => {
    const tasks_str = await new Promise((resolve, reject) => {
        redis.get('tasks', (err, res) => {
            if (err) 
                reject(err);
            else
                resolve(res);
        });
    });
    let tasks;
    if (tasks_str) {
        tasks = JSON.parse(tasks_str);
    } else {
        tasks = [];
    }
    const current_str = await new Promise((resolve, reject) => {
        redis.get('current_task', (err, res) => {
            if (err)
                reject(err);
            else
                resolve(res);
        });
    });
    if (current_str) {
        const current_task = JSON.parse(current_str);
        tasks.push(current_task);
    }
    tasks.push(option);
    tasks = tasks.sort((pretask, nexttask) => {
        const a = moment(pretask.date).add(pretask.hours, 'h').valueOf();
        const b = moment(nexttask.date).add(nexttask.hours, 'h').valueOf();
        return a - b;
    });
    const task = tasks.shift();
    await new Promise((resolve, reject) => {
        const str = JSON.stringify(tasks);
        redis.set('tasks', str, err => {
            if (err) 
                reject(err);
            else
                resolve();
        });
    });
    await new Promise((resolve, reject) => {
        const str = JSON.stringify(task);
        redis.set("current_task", str, err => {
            if (err)
                reject(err);
            else
                resolve();
        });
    });
};
// let time = moment(task.date).add(task.hours, 'h').diff(moment(), 'milliseconds');

exports.cancelTask = async (id) => {
    const tasks_str = await new Promise((resolve, reject) => {
        redis.get('tasks', (err, res) => {
            if (err)
                reject(err);
            else
                resolve(res);
        });
    });
    let tasks = JSON.parse(tasks_str);
    const current_str = await new Promise((resolve, reject) => {
        redis.get('current_task', (err, res) => {
            if (err)
                reject(err);
            else
                resolve(res);
        });
    });
    if (current_str) {
        const current_task = JSON.parse(current_str);
        tasks.unshift(current_task);
    }
    tasks = tasks.filter(task => {
        return task.id != id;
    });
    const task = tasks.shift();
    await new Promise((resolve, reject) => {
        const str = JSON.stringify(tasks);
        redis.set('tasks', str, err => {
            if (err)
                reject(err);
            else
                resolve();
        });
    });
    if (task) {
        await new Promise((resolve, reject) => {
            const str = JSON.stringify(task);
            redis.set("current_task", str, err => {
                if (err)
                    reject(err);
                else
                    resolve();
            });
        });
    } else {
        await new Promise((resolve, reject) => {
            redis.del("current_task", err => {
                if (err)
                    reject(err);
                else
                    resolve();
            });
        });
    }
};

async function nextTask () {
    const tasks_str = await new Promise((resolve, reject) => {
        redis.get('tasks', (err, res) => {
            if (err)
                reject(err);
            else
                resolve(res);
        });
    });
    const tasks = JSON.parse(tasks_str);
    const task = tasks.shift();
    await new Promise((resolve, reject) => {
        const str = JSON.stringify(tasks);
        redis.set('tasks', str, err => {
            if (err)
                reject();
            else
                resolve();
        });
    });
    if (task) {
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
            const str = JSON.stringify(task);
            redis.set("current_task", str, err => {
                if (err)
                    reject(err);
                else
                    resolve();
            });
        });
    }
};