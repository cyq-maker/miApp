const fs = require('fs'),
    path = require('path');

function readFile(pathname, cording = 'utf-8') {
    return new Promise((resolve, reject) => {
        pathname = path.resolve(pathname);
        fs.readFile(pathname, cording, (err, result) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(result);
        });
    });
}

function writeFile(pathname, data, cording = 'utf-8') {
    return new Promise((resolve, reject) => {
        if (typeof data != "string") {
            data = JSON.stringify(data);
        }
        pathname = path.resolve(pathname);
        fs.writeFile(pathname, data, cording, (err, result) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(result);
        });
    });
}

module.exports = {
    readFile,
    writeFile
}