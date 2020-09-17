var express = require('express');
var router = express.Router();
const fsPromise = require('../lib/myfs');
const {
  responseInfo
} = require('../lib/utils');

router.use(async (req, res, next) => {
  //在fsPromise.readFile中resolve的路径是根目录，所以路径填写以根目录为依据
  req.$NAV = JSON.parse(await fsPromise.readFile('./mock/nav.json'));
  req.$GOODS = JSON.parse(await fsPromise.readFile('./mock/goods.json'));
  next();
});
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Express'
  });
});

router.get('/navList', (req, res) => {
  let data = [];
  req.$NAV.map(item => {
    let params = {
      img: item.img,
      title: item.title
    }
    data.push(params);
  })
  if (!data) {
    responseInfo(res, {
      code: 1,
      codeText: "获取数据失败"
    });
    return;
  }
  responseInfo(res, {
    data
  });
});


router.get('/getGoods', (req, res) => {
 let data= req.$GOODS.filter(item => {
    return item.nav>=0;
  });
  console.log(data);
  if (!data) {
    responseInfo(res, {
      code: 1,
      codeText: "获取数据失败"
    });
    return;
  }
  responseInfo(res, {
    data
  });
});

module.exports = router;