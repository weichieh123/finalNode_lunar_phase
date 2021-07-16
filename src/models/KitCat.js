// 這邊是 model 裡面定義Class->拿來做crud

// 引入資料庫
const db = require(__dirname + '/../modules/mysql2-connect')

// CRUD
class KitCat {
  // `sid`, `author`, `bookname`, `category_sid`, `book_id`, `publish_date`, `pages`, `price`, `isbn`, `on_sale`, `introduction`（資料庫所有欄位都要對上，不可多，不可少 ）
  constructor(data) {
    // data: Object
    let defaultData = {
      kitCategoryId:null,
      kitCategoryName:'',
    }
    this.data = { ...defaultData, ...data } // 預設的值先解開來，後面的設定的會蓋掉前面的
  }

  // 新增
//   async add() {
//     if (this.data.sid) {
//       //如果原本已經有值了
//       return false //不讓他新增
//     }
//     let sql = 'INSERT INTO `kit_items` SET ?'
//     let [result] = await db.query(sql, [this.data]) // ?要塞資料進去
//     return result.kitItemId
//   }

  

  //讀取資料
  //getRows 拿陣列
  static async getRows(params = {}) {
    // let perPage = params.perPage || 6;  // 每頁有幾筆
    // let page = params.page || 2;  // 查看第幾頁
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

    // let orderStr = ''; //先給空字串
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
    //數我的項目有多少＝＝
    // let t_sql = `SELECT COUNT(1) num FROM \`kit_items\` ` //樣板字串，和資料表``衝到，要跳脫
    // let [r1] = await db.query(t_sql) // r= result
    // let total = r1[0]['num'];

    let r2, totalPages=0;
    
        // totalPages = Math.ceil(total/perPage);
        let r_sql = `SELECT * FROM \`kit_categories\` `;
        [r2] = await db.query(r_sql);
    
    return {
    //   total,
    //   totalPages,
    //   perPage,
    //   page,
    //   params,
      data: r2,
    }
  }

  //(會把 上面 r2從一般的object,包裝成Product的物件))
//   static async getItems(params = {}) {
//     let results = await KitSet.getRows(params)
//     if (results.data && results.data.length) {
//       //有資料、有長度再做轉換
//       results.data = results.data.map((el) => new KitSet(el)) //每個 element拿到都是object
//     }
//     return results
//   }

  // [讀取單筆資料:給id]
  // 拿到陣列
//   static async getRow(id) {
//     if (!id) return null // 沒拿到資料回傳空值
//     let sql = 'SELECT * FROM `kit_items` WHERE `id`=?'
//     let [r] = await db.query(sql, [id]) // 拿到result，陣列
//     if (!r || !r.length) {
//       // 沒有r或沒有長度
//       return null // 沒拿到資料回傳空值
//     }
//     return r[0] // 拿到第一筆資料的物件
//   }

  // 拿到物件
//   static async getItem(id) {
//     let row = await KitSet.getRow(id) // row拿到object
//     return new KitSet(row)
//   }

  // 刪除
//   async remove() {
//     if (!this.data.sid) return false
//     let sql = 'DELETE FROM `kit_items` WHERE `id`=?'
//     let [r] = await db.query(sql, [this.data.id])
//     if (r.affectedRows) {
//       //有影響到列數
//       this.data.sid = null // 刪除＝設定為空值
//       return true
//     } else {
//       return false
//     }
//   }
}

module.exports = KitCat
