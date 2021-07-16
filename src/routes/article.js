//黃
const express = require("express");

const Article = require(__dirname + "/../models/Article");

const router = express.Router();

/*
列表 + 篩選 (包含關鍵字搜尋）
單項商品
 */

// 取得所有商品 + 篩選 ?
router.get("/", async (req, res) => {
  res.json(await Article.getRows());
});

// 新增商品測試
router.get("/add", async (req, res) => {
  // const p1 = new Article({
  //   author: "abc",
  //   bookname: "XX大全",
  // });
  // const obj1 = await p1.save();

  // const p2 = await Article.getItem(23);
  // p2.data.author = "林小新2";
  // const obj2 = await p2.save();

  const p3 = await Article.getItem();
  res.json([req.baseUrl, req.url, obj1, obj2, await p3.remove()]);
});

// 取得單項商品
router.get("/all", async (req, res) => {
  // res.json(await Article.getRows({cate:3})); // 測試分類
  res.json(await Article.getRows({ keyword: "月經" })); // 測試關鍵字中有林
});

// 取得單項商品
// router.get("/a/:id", async (req, res) => {
//   res.json(await Article.getRows(23));
// });
// 取得單項
router.get("/:id", async (req, res) => {
  let p = await Article.getRow(req.params.id);
  res.json(p);
});

module.exports = router;
