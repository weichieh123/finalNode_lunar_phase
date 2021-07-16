const db = require('../modules/mysql2-connect')

const sqlSelect = "SELECT `items`.`itemId`, `items`.`itemNo` , `items`.`itemName`, `items`.`itemCoverImg`, `items`.`itemImg`, `items`.`itemPrice`, `items`.`itemQty`, `items`.`itemDescription`, `items`.`itemCategoryId`,  `items_categories`.`categoryName`, `cate2`.`categoryId` AS `categoryIdParent`, `cate2`.`categoryName` AS `categoryNameParent`,`items`.`itemFlowId`,`items_flow`.`flowName` ,`items_flow`.`flowImg` , `items`.`itemSize`, `items`.`itemOptionId`, `items_options`.`optionName`,`items`.`itemRanking`,`items`.`created_at`,`items`.`updated_at` FROM `items` INNER JOIN  `items_categories` ON `items`.`itemCategoryId` = `items_categories`.`categoryId` LEFT JOIN `items_categories` AS `cate2` ON `items_categories`.`categoryParentId` = `cate2`.`categoryId` INNER JOIN `items_flow` ON `items`.`itemFlowId` = `items_flow`.`flowId` INNER JOIN `items_options` ON `items`.`itemOptionId` = `items_options`.`optionId`"


class Product{
    // `itemId`, `itemNo`, `itemName`, `itemCoverImg`, `itemImg`, `itemPrice`, `itemQty`, `itemDescription`, `itemCategoryId`, `itemCategoryChildId`, `itemFlowId`, `itemSize`, `itemOptionId`, `itemTagId`, `itemRanking`,`created_at`, `updated_at`
    constructor(data){
        let defaultData = {
            itemId: null,
            itemNo: '',
            itemName: '',
            itemCoverImg: '',
            itemImg: [],
            itemPrice: 0,
            itemQty: 0,
            itemDescription: '',
            itemCategoryId: 0,
            itemFlowId: 0, 
            itemSize: '',
            itemOptionId: 0,
            itemTagId: '',
            itemRanking: 0
        }

        this.data = {...defaultData, ...data}
    };


    static async getRows(params={}){
        console.log(params)
        let perPage = params.perPage || 6;  // 每頁有幾筆
        let page = params.page || 1;  // 查看第幾頁
        let cate = parseInt(params.cate) || 0;  // 分類編號
        let catePa = parseInt(params.catePa) || 0;  // 分類編號
        let flow = parseInt(params.flow) || 0;  // 流量編號
        let keyword = params.keyword || '';  // 搜尋產品名稱或者描述
        let orderBy = params.orderBy || '';  // 排序

        // 注意SQL空格
        let where = ' WHERE 1 ';

        if(cate){
            // 分類搜尋子層
            where += ' AND `itemCategoryId`=' + cate;
        }
        if(catePa){
            // 分類搜尋父層
            where += ' AND `itemCategoryParentId`=' + catePa;
        }
        if(flow){
            // 流量搜尋
            where += ' AND itemFlowId=' + flow;
        }
        if(keyword){
            // keyword搜尋
            let k2 = db.escape('%' + keyword + '%');
            where += ` AND (itemName LIKE ${k2} OR itemDescription LIKE ${k2}) `;
        }
        
        // 排序 ORDER BY
        let orderStr = '';
        switch(orderBy){
            case '':
                orderStr = ' ORDER BY `itemId` ASC ';
                break;
            // case 'itemId':
            //     orderStr = ' ORDER BY `itemId` ASC ';
            //     break;
            case 'price-asc':
                orderStr = ' ORDER BY `itemPrice` ASC ';
                break;
            case 'price-desc':
                orderStr = ' ORDER BY `itemPrice` DESC ';
                break;
            case 'itemRanking':
            case 'rank-asc':
                orderStr = ' ORDER BY `itemRanking` ASC ';
                break;
            case 'rank-desc':
                orderStr = ' ORDER BY `itemRanking` DESC ';
                break;
        }

        // 得到所有數量
        let t_sql = `SELECT COUNT(1) num FROM \`items\` ${where}`;
        // console.log(t_sql)
        // 第一個結果 總共幾筆
        let [r1] = await db.query(t_sql);
        let total = r1[0]['num'];

        // 第二個結果 分頁幾筆
        let r2, totalPages=0;
        if(total){
            totalPages = Math.ceil(total/perPage);
            let r_sql = `${sqlSelect} ${where} ${orderStr} LIMIT ${(page-1)*perPage}, ${perPage}`;
            // console.log(r_sql)
            [r2] = await db.query(r_sql);
        }
        return {
            total,
            totalPages,
            perPage,
            page,
            cate,
            catePa,
            params,
            data: r2,
        }
    }
    
    // 轉換資料成Product物件
    static async getItems(params={}){
        let results = await Product.getRows(params);
        if(results.data && results.data.length){
            results.data = results.data.map(el=> new Product(el));
        }
        return results;
    }

    
    // 讀取所有
    static async getAllItems(){
        let sql = 
        `${sqlSelect} ORDER BY \`items\`.\`itemId\``;
        let [r] = await db.query(sql);
        if(!r || !r.length){
            return null;
        }
        return r;
    }
    

    
    //列出父分類
    static async getItemByCatePa(categoryIdParent){
        let sql = 
        `${sqlSelect} WHERE \`cate2\`.\`categoryId\` =? ORDER BY \`items\`.\`itemId\``;
        let [r] = await db.query(sql,[categoryIdParent]);
        if(!r || !r.length){
            return null;
        }
        return r;
    }
    
    // 列出子分類
    static async getItemByCate(itemCategoryId){
        let sql = 
        `${sqlSelect} WHERE \`itemCategoryId\`=? ORDER BY \`items\`.\`itemId\``;
        let [r] = await db.query(sql,[itemCategoryId]);
        if(!r || !r.length){
            return null;
        }
        return r;
    }


    // 列出不同分類？
    static async getCate(categoryParentId){
        let sql = "SELECT `items_categories`.`categoryId`, `items_categories`.`categoryName`, `cate2`.`categoryName` AS `categoryNameParent`  FROM `items_categories`LEFT JOIN `items_categories` AS`cate2`  ON `items_categories`.`categoryParentId` = `cate2`.`categoryId` WHERE `items_categories`.`categoryParentId` =?"

        let [r] = await db.query(sql,[categoryParentId]);
        if(!r || !r.length){
            return null;
        }
        return r;
    }

    // 列出流量分類
    static async getCateFlow(){
        let sql = "SELECT * FROM `items_flow`"
        let [r] = await db.query(sql);
        if(!r || !r.length){
            return null;
        }
        return r;
    }
    static async getCateFlowById(flowId){
        let sql = "SELECT * FROM `items_flow` WHERE `flowId`=? "
        let [r] = await db.query(sql,[flowId]);
        if(!r || !r.length){
            return null;
        }
        return r;
    }

    // 列出評價高的商品
    static async getByRanking(itemRanking){
        let sql = "SELECT * FROM `items` WHERE `itemRanking`=? LIMIT 3"
        let [r] = await db.query(sql,[itemRanking]);
        if(!r || !r.length){
            return null;
        }
        return r;
    }

    
    // 讀取單筆
    static async getItemById(itemId){
        if(!itemId) return null;
        let sql = `${sqlSelect} WHERE \`itemId\`=?`;
        let [r] = await db.query(sql, [itemId]);
        if(!r || !r.length){
            return null;
        }
        return r[0];
    }

    static async getItem(itemId) {
        let row = await Product.getRow(itemId);
        return new Product( row );
    }


}


module.exports = Product;
