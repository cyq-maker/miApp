const random = function (n, m) {
    return Math.round(Math.random() * (m - n) + n);
};
const areal1 = '0123456789';
const areal2 = 'ABCDEFGHIJKLNMOPQRSTUVWSYZ';

const queryPhone = function () {
    return new Array(10).fill(null).map(item => {
        return areal1[random(0, 9)];
    }).join('');
};
const queryName = function () {
    return new Array(8).fill(null).map(item => {
        return areal2[random(0, 25)];
    }).join('');
};

let arr = [];
for (let i = 2; i < 93; i++) {
    arr.push({
        id: i,
        name: queryName(),
        phone: `mi1${queryPhone()}`
    });
}

const fs = require('fs');
let USER_DATA = fs.readFileSync("./user.json", "utf8");
USER_DATA = JSON.parse(USER_DATA);
USER_DATA = USER_DATA.concat(arr);
fs.writeFileSync('./user.json', JSON.stringify(USER_DATA), 'utf8');