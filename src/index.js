// 1. 引入express
require('dotenv').config();
const port = process.env.PORT || 4567;
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

/* =====================Moana的=================== */

// 登入介面
app.get('/login', (req, res) => {
    if(req.session.admin) {
        res.redirect('/') //若登入轉向首頁
    } else {
        res.render('login')
    }
    res.render('login')
})

// 表單傳遞一般欄位資料
app.post('/login',async (req, res) => {
    const output = {
        success: false,
        error: '帳號或密碼錯誤',
        body: req.body
    }

    const sql = "SELECT * FROM `users` WHERE " + `userEmail = '${req.body.account}' AND userPassword = '${req.body.password}'`
    const [account] = await dbMysql2.query(sql)

    // 有資料，正列有長度
    if(account.length) {
        req.session.user = account[0]
        output.success = true
        output.error = ""
        output.data = account[0]
        res.json(output)
    } else {
        res.json(output)
    }
})

// 登入介面
app.get('/login', (req, res)=>{
    res.render('login');
})

// 登出，刪掉sessionId
app.get('/logout', (req, res) => {
    delete req.session.admin
    res.redirect('/')
})
/* =====================Moana的=================== */
/* =====================大家的路由=================== */
//J
app.use('/cart/product/order', require(__dirname + '/routes/order'));
app.use('/orderlist', require(__dirname + '/routes/orderList'));

// Tanya
app.use('/product', require(__dirname + '/routes/product'))

// Ruby
app.use('/event', require(__dirname + '/routes/event'));

//Sunny
app.use("/article", require(__dirname + "/routes/article"));

// Apple
app.use('/kitset', require(__dirname + '/routes/kitset'))
app.use('/kitcat', require(__dirname + '/routes/kitcat'))

/* =====================大家的路由=================== */

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