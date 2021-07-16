const express = require("express");
const router = express.Router();
const db = require(__dirname + '/../modules/mysql2-connect');


// 取得所有訂單 + 篩選?
router.get("/", async(req, res) => {
    res.json([req.baseUrl, req.url ]);
});

router.post("/add", async(req, res)=>{
    let output ={
        success: false,
        error:'',
        insertId: 0,
    };

    // `id`, `orderId`, `orderItemsId`, `checkPrice`, `checkQty`, `checkSubtotal`, `created_at`, `updated_at`
    for (let item of req.body.orderItems){
        const sql1 = "INSERT INTO `order_pitems` SET ?";
        const [results] = await db.query(sql1, [item]);
        console.log(req.body)
    }

    const sql2 = "INSERT INTO `orders_p` SET ?";
    const [results] = await db.query(sql2, [
        {
            orderId:req.body.orderInfo.orderId,
            username:req.body.orderInfo.username,
            receiverName:req.body.orderInfo.receiverName,
            receiverPhone:req.body.orderInfo.receiverPhone,
            orderPrice: req.body.orderInfo.orderPrice,
            shippingType:req.body.orderInfo.shippingType,
            shippingPrice:req.body.orderInfo.shippingPrice,
            conStore:req.body.orderInfo.conStore,
            conAddress:req.body.orderInfo.conAddress,
            homeAddress:req.body.orderInfo.homeAddress,
            paymentType: req.body.orderInfo.paymentType,
        }
    ]);

    output = {...output, body: req.body.orderInfo};
    res.json(output);
})

module.exports = router;


