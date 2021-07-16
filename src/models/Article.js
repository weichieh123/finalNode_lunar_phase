const db = require(__dirname + "/../modules/mysql2-connect");

// CRUD
class Article {
  // `sid`, `author`, `bookname`, `category_sid`, `book_id`, `publish_date`, `pages`, `price`, `isbn`, `on_sale`, `introduction`
  constructor(data) {
    // data: Object
    let defaultData = {
      id: null,
      articleId: "",
      articleName: "",
      articleContent0: "",
      articleContent1: "",
      articleContent2: "",
      articleContent3: "",
      articleAuthor: "",
      articleTagId: 0,
      articleTag: "",
      articleCategory: "",
      article_like: 0,
      articleImg: [],
      memberAcoount: "",
      comment: "",
      commentLike: "",
      created_at: "1970-01-01",
      updated_at: "1970-01-01",
    };
    this.data = { ...defaultData, ...data };
  }

  // 儲存：新增 或 修改
  async save() {
    // 如果 sid 為 null, 表示是新建的物件
    if (!this.data.id) {
      let sql = "INSERT INTO `article` SET ?";
      let [result] = await db.query(sql, [this.data]);
      if (result.insertId) {
        this.data.id = result.insertId;
        return this.data;
      } else {
        return false; // 新增失敗的情況
      }
    } else {
      // 如果 sid 已經有值，就做更新
      const o = { ...this.data };
      delete o.id;

      let sql = "UPDATE `article` SET ? WHERE `id`=?";
      let [result] = await db.query(sql, [o, this.data.id]);
      if (result.changedRows) {
        return this.data;
      } else {
        return false; // 沒有修改
      }
    }
  }

  static async getRows(params = {}) {
    let perPage = params.perPage || 8; // 每頁有幾筆
    let page = params.page || 1; // 查看第幾頁
    let cate = parseInt(params.cate) || 0; // 分類編號
    let keyword = params.keyword || ""; // 搜尋產品名稱或者作者姓名
    let orderBy = params.orderBy || ""; // 排序

    let where = " WHERE 1 ";
    if (cate) {
      where += " AND category_sid=" + cate;
    }
    if (keyword) {
      let k2 = db.escape("%" + keyword + "%");
      where += ` AND (author LIKE ${k2} OR bookname LIKE ${k2}) `;
    }

    let orderStr = "";
    switch (orderBy) {
      case "price":
      case "price-asc":
        orderStr = " ORDER BY `price` ASC ";
        break;
      case "price-desc":
        orderStr = " ORDER BY `price` DESC ";
        break;
      case "created_at":
      case "created_at-asc":
        orderStr = " ORDER BY `created_at` ASC ";
        break;
      case "created_at-desc":
        orderStr = " ORDER BY `created_at` DESC ";
        break;
    }

    let t_sql = `SELECT COUNT(1) num FROM \`article\` ${where}`;
    let [r1] = await db.query(t_sql);
    let total = r1[0]["num"];

    let r2,
      totalPages = 0;
    if (total) {
      totalPages = Math.ceil(total / perPage);
      let r_sql = `SELECT * FROM \`article\` ${where} ${orderStr} LIMIT ${
        (page - 1) * perPage
      }, ${perPage}`;
      [r2] = await db.query(r_sql);
    }
    return {
      total,
      totalPages,
      perPage,
      page,
      params,
      data: r2,
    };
  }

  static async getItems(params = {}) {}

  // 讀取單筆
  static async getRow(id) {
    if (!id) return null;
    let sql = "SELECT * FROM `article` WHERE `id`=?";
    let [r] = await db.query(sql, [id]);
    console.log([r]);
    if (!r || !r.length) {
      return null;
    }
    return r[0];
  }

  static async getItem(id) {
    let row = await Article.getRows(id);
    console.log(row);
    return new Article(row);
  }

  // 刪除
  async remove() {
    if (!this.data.id) return false;
    let sql = "DELETE FROM `article` WHERE `id`=?";
    let [r] = await db.query(sql, [this.data.id]);
    if (r.affectedRows) {
      this.data.id = null;
      return true;
    } else {
      return false;
    }
  }
}

module.exports = Article;
