// 1. 引入express
require('dotenv').config();
const port = process.env.PORT || 4567;
const express = require('express');
const session = require('express-session');
const MysqlStore = require('express-mysql-session')(session);
const db = require(__dirname + '/modules/mysql2-connect');
const sessionStore = new MysqlStore({}, db);
const cors = require('cors');

/* Moana part */
const fs = require('fs')
// 檔案解析套件
const multer = require('multer')
const upload = multer({dest: 'tmp_uploads/'})
const {v4 : uuidv4} = require('uuid')

/* Moana part */

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
    let a = ''
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

// 會員註冊
app.post('/register',async (req, res) => {
    const output = {
        success: false,
        error: "資料不完整"
    }
    let sql = "SELECT `userEmail`,`userPassword` FROM `users` WHERE userEmail = " + `'${req.body.account}'`
    // 前端欄位都有資料
    if (req.body.account && req.body.password && req.body.confirm_password) {
        // res.json({
        //     acc: req.body.account,
        //     pwd: req.body.password,
        //     c_pwd: req.body.confirm_password
        // })

        // 前端密碼與確認密碼比對，如果沒有帳號，就新增帳號
        if (req.body.password === req.body.confirm_password) {
            // 前端帳號與資料庫帳號比對
            const [account] = await dbMysql2.query(sql)
            const data = account[0]

            if (account.length) {
                // res.json(date)
                output.success = false
                output.error = '不能使用此帳號'
                res.json(output)
            }
            else {
                // 測試: SELECT `userEmail`,`userPassword` FROM `users` WHERE userEmail = 'm@gmail.com';
                sql = "INSERT INTO `users`(`userEmail`, `userPassword`) VALUES " +`('${req.body.account}', '${req.body.password}')`
                dbMysql2.query(sql)
                output.success = true
                output.error = '新增帳號'
                res.json(output)
            }
        }
    }
    res.json(output)
})

const extMap = {
    'image/png': '.png',
    'image/jpeg': '.jpg'
}

// 個人資料
app.post('/upload-profile',upload.single('avatar') ,async (req, res) => {

    let profile = {
        email: req.body.email,
        avatar: req.file,
        fullname: req.body.fullname,
        birthday: req.body.birthday,
        phone: req.body.phone,
        address: req.body.address,
        gender: req.body.gender
    }

    // 大頭貼
    let newName = ''
    if(extMap[profile.avatar.mimetype]) {
        newName = uuidv4() + extMap[profile.avatar.mimetype]
        await fs.promises.rename(profile.avatar.path, './public/img/' + newName)
        profile.avatar = newName
    }

    // 日期
    let birthday = ''
    if(profile.birthday) {
        birthday = profile.birthday
        birthday = birthday.split('-')
        profile.birthday = birthday.join('/')
    }

    // 更新資料
    sql = `UPDATE users \
            SET userName='${profile.fullname}',userBirthday='${profile.birthday}',userPhone='${profile.phone}',userAddress='${profile.address}',useGender='${profile.gender}',useImg='${profile.avatar}' \
            WHERE userEmail='${profile.email}'`
    await dbMysql2.query(sql)

    res.json({
        success: true,
        data: profile
    })
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