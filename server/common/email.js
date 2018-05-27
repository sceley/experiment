const nodemailer = require('nodemailer');
const config = require('../config');
let transporter = nodemailer.createTransport(config.email);
const html = (body) =>
    `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>Document</title>
    </head>
    <body>
        ${body}
    </body>
    </html>
    `;
exports.sendEmail = async () => {
    let mailOptions = {
        from: '智联科技<sceley520@126.com>', // sender address
        to: '954181939@qq.com', // list of receivers
        subject: '智联科技实验室', // Subject line
        html: html(`有新的客户连接到智联科技网站。`) // html body
    };
    await new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};