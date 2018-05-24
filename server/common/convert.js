exports.convert_to_str = (option) => {
    for (const key in option) {
        option[key] = String(option[key]);
    }
    while (option.NUM.length !== 4) {
        option.NUM = '0' + option.NUM;
        if (option.NUM.length > 4) {
            break;
        }
    }
    while (option.EXP.length !== 2) {
        option.EXP = '0' + option.EXP;
        if (option.EXP.length > 2) {
            break;
        }
    }
    while (option.TAB.length !== 2) {
        option.TAB = '0' + option.TAB;
        if (option.TAB.length > 2) {
            break;
        }
    }
    while (option.ID.length !== 2) {
        option.ID = '0' + option.ID;
        if (option.ID.length > 2) {
            break;
        }
    }
    let str = '';
    for (let key in option) {
        str += `${key}${option[key]}`;
    }
    return str;
};

exports.convert_to_obj = (str) => {
    let obj = {};
    let pattern = /(NUM)(\d{4})(EXP)(\d{2})(TAB)(\d{2})(ID)(\d{2})(POW)(\d{1})(FAU)(\d{1})/;
    str.replace(pattern, (match, ...code) => {
        let arr = code.slice(0, -2);
        for (let i = 0; i < arr.length; i = i + 2) {
            obj[arr[i]] = arr[i + 1];
        }
    });
    return obj;
};