// 這邊是路由檔案
const express = require('express');
const KitCat = require(__dirname + '/../models/Kitcat')
const router = express.Router();

/*
列表 + 篩選 (包含關鍵字搜尋)
單項商品
 */

// 取得所有商品 + 陳列 (前台：沒有要編輯商品)
router.get('/', async (req, res)=>{
    res.json(await KitCat.getRows(req.query));
    // console.log('這是', res.json(await KitSet.getRows(req.query)))
});



// 新增商品測試
// router.get('/add', async (req, res)=>{
//     const k1 = new KitSet({
//         itemNo:'aaa',
//         itemName:'衛生棉XXXTOOO',
// //     });
//     const newkitItemId = await k1.save();
//     res.json([req.baseUrl, req.url, newkitItemId])
// // });

// // 取得單項商品
// router.get('/all', async (req, res)=>{
//     // res.json(await Event.getRows({cate:3})); // 測試分類
//     res.json(await KitSet.getRows({keyword:'藝文'})); // 測試關鍵字中有林
// });

// 取得單項商品
// router.get('/:id', async (req, res)=>{
//     res.json(await KitSet.getRow(req.params.id));
// });



module.exports = router; 