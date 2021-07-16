const express = require('express');

const Product = require(__dirname + '/../models/Product');

const router = express.Router();


// 取得所有商品 + 篩選 ***
router.post('/', async (req, res)=>{
    // res.json([req.baseUrl, req.url]);
    console.log(req.body)
    res.json(await Product.getRows(req.body));
});

// 取得所有商品 全表完整內容
router.get('/all', async (req, res)=>{
    // res.json([req.baseUrl, req.url]);
    res.json(await Product.getAllItems());
});

// 取得評價商品
router.get('/ranking/:itemRanking', async (req, res)=>{
    res.json(await Product.getByRanking(req.params.itemRanking));
});



// 取得父分類商品
router.get('/category-p/:categoryIdParent', async (req, res)=>{
    let p = await Product.getItemByCatePa(req.params.categoryIdParent)
    // let count = '篩選數量: '+ p.length
    // res.json([req.baseUrl, req.url, count, p]);
    res.json(p);
});


// 取得子分類商品
router.get('/category/:itemCategoryId', async (req, res)=>{
    let p = await Product.getItemByCate(req.params.itemCategoryId)
    // let count = '篩選數量: '+ p.length
    // res.json([req.baseUrl, req.url, count, p]);
    // res.json([count, p]);
    res.json(p);
});

// 取得父分類選項
router.get('/category-select/:categoryParentId', async (req, res)=>{
    res.json(await Product.getCate(req.params.categoryParentId));
});

// 取得流量分類
router.get('/flow/', async (req, res)=>{
    res.json(await Product.getCateFlow(req.params));
});
router.get('/flow/:flowId', async (req, res)=>{
    res.json(await Product.getCateFlowById(req.params.flowId));
});


// 取得單項商品
router.get('/:itemId', async (req, res)=>{

    let p = await Product.getItemById(req.params.itemId)

    // res.json([req.baseUrl, req.url, p]);
    res.json(p);
});


module.exports = router;
