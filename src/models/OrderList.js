// OrderList: 列出所有訂單
// 這邊是 model 裡面定義Class->拿來做crud

// 引入資料庫 
const db = require(__dirname + '/../modules/mysql2-connect')

class OrderList {
    // `orderId`, `username`, `receiverName`, `receiverPhone`, `orderPrice`, `shippingType`, `shippingPrice`, `conStore`, `conAddress`, `homeAddress`, `paymentType`, `created_at`, `updated_at`（資料庫所有欄位都要對上，不可多，不可少 ）
    constructor(data) {
        // data: Object
        let defaultData = {
            orderId: 0,
            username: '',
            receiverName: 0,
            receiverPhone: '',
            orderPrice: ' ',
            shippingType: 0,
            shippingPrice: 0,
            conStore: '',
            conAddress: 1,
            homeAddress: '',
            paymentType: '',
            orCondition: '',
            created_at: '1970-01-01',
            updated_at: '1970-01-01'
        };
        this.data = {...defaultData, ...data}; // 預設的值先解開來，後面的設定的會蓋掉前面的 
    }

    //讀取資料
    static async getRows(params={}){
        let perPage = params.perPage || 6;  // 每頁有幾筆
        let page = params.page || 2;  // 查看第幾頁
        // let cate = parseInt(params.cate) || 0;  // 分類編號
        // let keyword = params.keyword || '';  // 搜尋產品名稱或者作者姓名
        // let orderBy = params.orderBy || '';  // 排序

        let where = ' WHERE 1 '; //
        // if(cate){
        //     where += ' AND category_sid=' + cate;
        // }
        // if(keyword){
        //     let k2 = db.escape('%' + keyword + '%'); // 百分比先接起來，再去escape：會跳脫 加單引號
        //     where += ` AND (eventCategory LIKE ${k2}) `;
        //     // where += ` AND (eventCategory LIKE ${k2} OR bookname LIKE ${k2}) `;
        // }

        let orderStr = 'ORDER BY `orders_p`.`created_at` DESC'; //先給空字串
        // switch(orderBy){
        //     case 'price':
        //     case 'price-asc':
        //         orderStr = ' ORDER BY `price` ASC '; // 升冪
        //         break;
        //     case 'price-desc':
        //         orderStr = ' ORDER BY `price` DESC '; // 降冪 
        //         break;
        //     case 'pages':
        //     case 'pages-asc':
        //         orderStr = ' ORDER BY `pages` ASC ';
        //         break;
        //     case 'pages-desc':
        //         orderStr = ' ORDER BY `pages` DESC ';
        //         break;
        // }

        let t_sql = `SELECT COUNT(1) num FROM \`orders_p\` ${where}`; //樣板字串，和資料表``衝到，要跳脫
        let [r1] = await db.query(t_sql); // r= result
        let total = r1[0]['num'];

        let r2, totalPages=0;
        if(total){
            totalPages = Math.ceil(total/perPage);
            let r_sql = `SELECT * FROM \`orders_p\` ${where} ${orderStr} LIMIT 10`;
            [r2] = await db.query(r_sql);
        }

        // let ten_sql=`SELECT * FROM \`order_pitems\`  INNER JOIN \`orders_p\` ON \`order_pitems\`.\`orderId\` =  \`orders_p\`.\`orderId\` LEFT JOIN \`items\` ON \`order_pitems\`.\`orderItemsId\` = \`items\`.\`itemId\` 
        // ORDER BY \`\orders_p\`.\`created_at\` DESC LIMIT 15`

        // let [r3] = await db.query(ten_sql);
        // if(!r3 || !r3.length){
        //     return null;
        // }

        return { 
            total,
            totalPages,
            perPage,
            page,
            params,
            data: r2,
        }
    }

    // 讀取單筆
    static async getOrderById(orderId){
        if(!orderId) return null;
        // let sql = 'SELECT * FROM `orders_p` WHERE `orderId`=?';
        // let sql = 'SELECT * FROM `order_pitems` INNER JOIN `orders_p` ON `order_pitems`.`orderId` =  `orders_p`.`orderId` WHERE `order_pitems`.`orderId`=?';
        let sql = 'SELECT * FROM `order_pitems` INNER JOIN `orders_p` ON `order_pitems`.`orderId` =  `orders_p`.`orderId` LEFT JOIN `items`ON `order_pitems`.`orderItemsId` = `items`.`itemId`  WHERE `order_pitems`.`orderId`=?';
        let [r] = await db.query(sql, [orderId]);
        if(!r || !r.length){
            return null;
        }
        return r;
    }



}

module.exports = OrderList