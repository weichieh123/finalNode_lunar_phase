// 這邊是路由檔案
const express = require('express');

const OrderList = require(__dirname + '/../models/OrderList');

const router = express.Router();

// 取得所有商品 + 篩選 ?
router.get('/', async (req, res)=>{
    res.json(await OrderList.getRows());
    
});

router.get('/:orderId', async (req, res)=>{

    let p = await OrderList.getOrderById(req.params.orderId)

    // res.json([req.baseUrl, req.url, p]);
    res.json(p);
});


module.exports = router; 