const db = require('../model/db');
exports.spliceData = async (body, id) => {
    let NUM = body.NUM;
    let EXP = body.Exp;
    let TAB = body.Tab;
    let ID = body.ID;
    while (NUM.length !== 4) {
        NUM = '0' + NUM;
    }
    while (EXP.length !== 2) {
        EXP = '0' + EXP;
    }
    while (TAB.length !== 2) {
        TAB = '0' + TAB;
    }
    let obj = {
        NUM,
        ID,
        TAB,
        EXP,
        POW: 1,
        DOR: 1,
        FAU: 1
    };
    let str = '';
    for (let key in obj) {
        str += `${key}${obj[key]}`;
    }
    return str;
};
//let data = "NUM1234EXP12TAB10ID16051223POW1DOR1FAU1";
exports.splitData = (str) => {
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