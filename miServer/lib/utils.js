var fs = require('fs');

function responseInfo(res, options) {
    let config = Object.assign({
        code: 0,
        codeText: 'ok',
        data: {}
    }, options);
    res.status(200).type('application/json').send(config);
}

function againMD5(text) {
    return text.substring(4, text.length - 4).split('').reverse().join('');
}

function checkTime(time) {
    let nowT = new Date();
    return (nowT - time) <= (30 * 60 * 1000);
}

function writeData(obj, url, res) {
    let arr = [];

    arr.push(obj); //在真实的开发中id肯定是随机生成的而且不会重复的，下一篇写如何生成随机切不会重复的随机数，现在就模拟一下假数据
    //写入json文件选项
    //现将json文件读出来
    fs.readFile(url, function (err, data) {
        if (err) {
            responseInfo(res, {
                code: 1,
                codeTextL: '读入出错'
            });
            return;
        }
        let USER_DATA = JSON.parse(data.toString());
        USER_DATA = USER_DATA.concat(arr);
        var str = JSON.stringify(USER_DATA); //因为nodejs的写入文件只认识字符串或者二进制数，所以把json对象转换成字符串重新写入json文件中
        fs.writeFile(url, str, function (err) {
            if (err) {
                responseInfo(res, {
                    code: 1,
                    codeTextL: '写入失败'
                })
            } else {
                responseInfo(res, {
                    code: 0,
                })
            }

        })
    })

}

function deleteData(id, url, res) {
    fs.readFile(url, function (err, data) {
        if (err) {
            responseInfo(res, {
                code: 1,
                codeTextL: '读入出错'
            });
            return;
        }
        var person = data.toString();
        person = JSON.parse(person);
        console.log(person);
        //把数据读出来删除
        for (var i = 0; i < person.length; i++) {
            if (id == parseInt(person[i].id)) {
                //console.log(person.data[i])
                person.splice(i, 1);
            }
        }
        // person.total = person.length;
        var str = JSON.stringify(person);
        console.log(str);
        //然后再把数据写进去
        fs.writeFile(url, str, function (err) {
            if (err) {
                responseInfo(res, {
                    code: 1,
                    codeTextL: '写入失败'
                })
            }
            responseInfo(res, {
                code: 0,
            })
        })
    })


}

function changeData(id, data, url, res) {
    var params = data;
    console.log(params);


    fs.readFile(url, function (err, data) {
        if (err) {
            responseInfo(res, {
                code: 1,
                codeTextL: '读入出错'
            });
            return;
        }
        var person = data.toString();
        person = JSON.parse(person);
        //把数据读出来,然后进行修改
        for (var i = 0; i < person.length; i++) {
            if (id == person[i].id) {
                for (var key in params) {
                    if (person[i][key]) {
                        person[i][key] = params[key];
                    }
                }
            }
        }
        var str = JSON.stringify(person);
        //console.log(str);
        fs.writeFile(url, str, function (err) {
            if (err) {
                responseInfo(res, {
                    code: 1,
                    codeTextL: '写入失败'
                })
            }
            responseInfo(res, {
                code: 0,
            })
        })
    })

}
module.exports = {
    responseInfo,
    againMD5,
    checkTime,
    writeData,
    changeData,
    deleteData
};