// 1. 引入express
require('dotenv').config();
const port = process.env.PORT || 4568;
const express = require('express');
const session = require('express-session');
const MysqlStore = require('express-mysql-session')(session);
const db = require(__dirname + '/modules/mysql2-connect');
const sessionStore = new MysqlStore({}, db);
const cors = require('cors');

// 2. 建立web server 物件
const app = express();

// 將下列程式，放在所有路由設定的前面
const corsOptions = {
    credentials: true,
    origin: function(origin, cb){
        cb(null, true);
    }
};
app.use(cors(corsOptions));
app.use(express.json()); //註解掉會讓 req.body 讀不到 JSON 資料，這是因為 express.json() middleware 幫我們讀資料和轉換成 JSON Object
app.use(express.static(__dirname + '/../public'));
app.use(session({
    saveUninitialized: false,
    resave: false,
    secret: 'lgheuifunldaoiewaifebwfoweafewd', //加密cookie
    // store: sessionStore,
    store: sessionStore,
    cookie: { 
        maxAge: 1200000,
    }
}));
// 3. 路由
app.get('/', (req, res)=>{
    const d = require(__dirname + '/../data/items');
    res.render('home',{items: d});
});

//J
app.use('/cart/product/order', require(__dirname + '/routes/order'));
app.use('/orderlist', require(__dirname + '/routes/orderList'));

// Tanya
app.use('/product', require(__dirname + '/routes/product'))


// *** 此段放在所有路由設定的後面***
app.use((req, res) => {
    res.type('text/plain');
    res.status(404);
    res.send('404 - 找不到網頁');
});

// 4. Server 偵聽
app.listen(port, function () {
    console.log(`server started ${port}`);
});