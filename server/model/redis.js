const redis = require('redis');
const client = redis.createClient();
async function doing() {
    try {
        let task = await new Promise((resolve, reject) => {
            client.get('tasks', (err, res) => {
                if (err)
                    reject(err);
                else
                    resolve(res);
            });
        });
        if (!task) {
            await new Promise((resolve, reject) => {
                let arr = [];
                let str = JSON.stringify(arr);
                client.set('tasks', str, err => {
                    if (err) 
                        reject(err);
                    else
                        resolve();
                });
            });
        }
    } catch (e) {
    
    }

};
doing();
module.exports = client;