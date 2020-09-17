var express = require('express');
var router = express.Router();


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
  req.$PRODUCT = JSON.parse(await fsPromise.readFile('./mock/product.json'));
  req.$CG = JSON.parse(await fsPromise.readFile('./mock/category.json'));
  next();
});

// /* GET users listing. */
// router.get('/', function (req, res, next) {
//   res.send('respond with a resource');
// });

/* 接口 */
//登陆处理
router.get('/info', (req, res) => {
  let id = req.query.id || 0;
  let data;
  console.log(id);
  data = req.$PRODUCT.find(item => {
    return item.id === parseInt(id);
  })
  console.log(data);
  if (!data) {
    responseInfo(res, {
      code: 1,
      codeText: '没有该商品'
    });
    return;
  }
  responseInfo(res, {
    data
  })

})
router.get('/list', (req, res) => {

  let data;
  data = req.$CG;
  if (!data) {
    responseInfo(res, {
      code: 1,
      codeText: '没有该商品'
    });
    return;
  }
  responseInfo(res, {
    data
  })

})

module.exports = router;