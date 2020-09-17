var express = require('express');
var router = express.Router();
var md5 = require('md5-node');


const fsPromise = require('../lib/myfs');
const {
  againMD5,
  checkTime,
  responseInfo,
  writeData,
  changeData
} = require('../lib/utils');

//把所有数据得到
router.use(async (req, res, next) => {
  //在fsPromise.readFile中resolve的路径是根目录，所以路径填写以根目录为依据
  req.$USER = JSON.parse(await fsPromise.readFile('./mock/user.json'));
  req.$CODE = JSON.parse(await fsPromise.readFile('./mock/code.json'));
  next();
});

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

/* 接口 */
//登陆处理
router.post('/login', (req, res) => {
  let {
    name,
    password,
    type
  } = req.body || {};
  password = againMD5(password);
  console.log(req.body);
  let data;
  //账号密码登录
  if (parseInt(type) === 2) {
    data = req.$USER.find(item => {
      return (item.name === name || item.phone === name) && item.password === password;
    });

  } else { //短信验证码登录
    data = req.$CODE.find(item => {
      return item.phone === name && item.code === password && checkTime(item.time);
    });
    if (data) {
      data = req.$USER.find(item => {
        return item.phone === data.phone;
      });
    }
  }
  //返回对应结果
  if (data) {
    //如果登录成功，需要服务端记录登录态
    req.session.userId = data['id'];
    responseInfo(res, {
      data: {
        id: data['id'],
        name: data['name'],
        phone: data['phone'],
        pic: data['pic']
      }
    });

  } else {
    responseInfo(res, {
      code: 1,
      codeText: '账号不存在，或者密码错误'
    });
    return;
  }

})

router.post('/register', (req, res) => {
  let {
    name,
    phone,
    password
  } = req.body || {};
  password = againMD5(password);

  let data;

  data = req.$USER.find(item => {
    return item.phone === phone;
  });


  //返回对应结果
  if (!data) {
    let obj = {
      id: 2,
      name: name,
      phone: phone,
      password: password,
      pic: null
    }
    writeData(obj, './mock/user.json', res);
  } else {

    responseInfo(res, {
      code: 1,
      codeText: '账号不存在，或者密码错误'
    });
    return;
  }

})
router.get('/login', (req, res) => {
  let userId = req.session.userId;
  console.log(userId);
  if (!userId) {
    responseInfo(res, {
      code: 1,
      codeText: '没有登录'
    })
    return;
  }
  console.log(1);
  req.$USER.forEach(item => {

    if (item.id === userId) {

      responseInfo(res, {
        data: {
          id: item.id,
          name: item.name,
          phone: item.phone,
          pic: item.pic
        }
      });
      return;
    }
  });

})
router.get('/info', (req, res) => {
  let {
    id
  } = req.body || {};
  let userId = req.session.userId;
  if (id) userId = id;

  if (!userId) {
    responseInfo(res, {
      code: 1,
      codeText: '没有登录'
    })
    return;
  }
  req.$USER.forEach(item => {
    if (item.id === userId) {
      responseInfo(res, {
        data: {
          id: item.id,
          name: item.name,
          phone: item.phone,
          pic: item.pic
        }
      });
    }
  });

})
router.get('/loginout', (req, res) => {
  req.session.userId = null;
  responseInfo(res, {
    code: 0,
    codeText: '退出登录'
  });
});
router.post('/checkCode', (req, res) => {
  let {
    phone,
    code
  } = req.body || {};
  code = againMD5(code);
  let data;
  data = req.$CODE.find(item => {
    return item.phone === phone && item.code === code;
  })
  if (!data) {
    responseInfo(res, {
      code: 1,
      codeText: '验证码错误'
    })
  }
  responseInfo(res, {
    code: 0
  })
});
router.post('/phone', (req, res) => {
  let {
    phone
  } = req.body || {};
  let data;
  data = req.$USER.find(item => {
    return item.phone === phone;
  })
  if (!data) {
    responseInfo(res, {
      code: 1,
      codeText: '账号不存在'
    })
  }
  responseInfo(res, {
    code: 0
  })
});
router.post('/registerCode', (req, res) => {
  let {
    phone
  } = req.body || {};
  let data;
  let arr = [];
  let randomNum = Math.random().toString().slice(-6);
  console.log(randomNum);
  data = req.$CODE.find(item => {
    if (item.phone === phone) {
      responseInfo(res, {
        code: 1,
        codeText: '账号已注册，请登录'
      })
      return;
    }
  })
  let obj = {
    id: 2,
    code: againMD5(md5(randomNum)),
    phone: phone,
    time: new Date().getMilliseconds()
  }
  writeData(obj, './mock/code.json', res);

});
router.post('/loginCode', (req, res) => {
  let {
    phone
  } = req.body || {};
  let data;
  let randomNum = Math.random().toString().slice(-6);
  console.log(randomNum);
  randomNum = againMD5(md5(randomNum));
  data = req.$CODE.find(item => {
    return item.phone === phone;
  })
  if (!data) {
    responseInfo(res, {
      code: 1,
      codeText: '发送验证码失败'
    })
  }
  let params = {
    id: parseInt(data.id)
  }
  changeData(params, randomchangeNum, './mock/code.json', res);

});


module.exports = router;