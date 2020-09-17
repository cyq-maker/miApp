var express = require('express');
var router = express.Router();


const fsPromise = require('../lib/myfs');
const {
  deleteData,
  responseInfo,
  writeData,
  changeData,
  againMD5
} = require('../lib/utils');

//把所有数据得到
router.use(async (req, res, next) => {
  //在fsPromise.readFile中resolve的路径是根目录，所以路径填写以根目录为依据
  req.$PRODUCT = JSON.parse(await fsPromise.readFile('./mock/product.json'));
  req.$CART = JSON.parse(await fsPromise.readFile('./mock/cart.json'));
  req.$USER = JSON.parse(await fsPromise.readFile('./mock/user.json'));
  next();
});

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

/* 接口 */
//登陆处理
router.post('/list', (req, res) => {
  const userId = req.session.userId;
  console.log("+++");
  console.log(req.session);

  let data = [];
  req.$CART.forEach(item => {
    if (item.pid === userId) {
      data.push(item);
    }
  })
  console.log("---");
  console.log(data);
  if (!data) {
    responseInfo(res, {
      code: 1,
      codeText: '不存在该商品'
    });
    return;
  }
  responseInfo(res, {
    data
  });
});
//添加并返回购物车为5的
router.post('/add', (req, res) => {
  let {
    id,
    count
  } = req.body || {};
  count = parseInt(count);
  const userId = req.session.userId;
  if (!userId) {
    responseInfo(res, {
      code: 1,
      condeText: "userId失效"
    });
    return;
  }

  let data, cart;
  data = req.$PRODUCT.find(item => {
    return item.id === parseInt(id);
  })
  cart = req.$CART.find(item => {
    return item.id === data.id && item.state === 5;
  });
  if (cart) {
    let params = {
      count: cart.count + count
    }
    changeData(cart.id, params, './mock/cart.json', res);
  } else {
    let obj = {
      id: data.id,
      pid: userId,
      count: count,
      state: 5,
      name: data.title,
      pic: data.images[0],
      price: data.discount || data.origin,
      store: data.store
    }
    writeData(obj, './mock/cart.json', res);
  }
  if (!data) {
    responseInfo(res, {
      code: 1,
      codeText: '添加失败'
    });
    return;
  }
  // responseInfo(res);
})
//修改购物车的数量
router.post('/update', (req, res) => {
  let {
    id,
    count
  } = req.body || {};
  count = parseInt(count);
  const userId = req.session.userId;
  if (!userId) {
    responseInfo(res, {
      code: 1,
      condeText: "userId失效"
    });
    return;
  }
  let params = {
    count: count
  }
  changeData(id, params, './mock/cart.json', res);
})
router.post('/remove', (req, res) => {
  let {
    id
  } = req.body || {};
  id = parseInt(id);
  const userId = req.session.userId;
  if (!userId) {
    responseInfo(res, {
      code: 1,
      condeText: "userId失效"
    });
    return;
  }
  console.log(id);
  deleteData(id, './mock/cart.json', res);
})
router.post('/payPass', (req, res) => {
  let {
    password
  } = req.body || {};
  password = againMD5(password);
  const userId = req.session.userId;
  let data = req.$USER.find(item => {
    return item.id === userId && item.payPass === password;
  })
  if (!data) {
    responseInfo(res, {
      code: 1,
      codeText: "密码出错或者不存在该用户"
    });
    return;
  }
  responseInfo(res);

})

router.post('/state', (req, res) => {
  let {
    id,
    state
  } = req.body || {};
  console.log(id);
  const userId = req.session.userId;
  if (!userId) {
    responseInfo(res, {
      code: 1,
      condeText: "userId失效"
    });
    return;
  }
  console.log('---');
  let data = req.$CART.find(item => {
    return item.id === parseInt(id);
  });
  console.log(data);
  if (data) {
    let params = {
      state: parseInt(state)
    }
    console.log(params);
    changeData(id, params, './mock/cart.json', res);
    return;
  } else {
    responseInfo(res, {
      code: 1,
      condeText: "不存在该订单"
    });
    return;
  }

})



module.exports = router;