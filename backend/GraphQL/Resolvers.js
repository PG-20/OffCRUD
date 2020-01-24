const mysql_access = require('../data-access/mysql_access');


module.exports = {
    hello: () => "hi",
    getProducts: async () => {
        const sql = "select * from sample_project.products";

        return await mysql_access.query(sql, null);
    },
    editProduct: async (args) => {
        let productToEdit = args.input;
        const sql = `UPDATE sample_project.products     
                    SET name="${productToEdit.name}", 
                    quantity=${productToEdit.quantity}, price=${productToEdit.price} 
                    WHERE productID=${productToEdit.productID}`;
        let res = await mysql_access.query(sql, null);
        console.log(res);
        return productToEdit;
    },
    addProduct: async (args) => {
        let productToAdd = args.input;
        let sql = `INSERT INTO sample_project.products (name, quantity, price)
                    VALUES ("${productToAdd.name}", 
                    ${productToAdd.quantity}, ${productToAdd.price});`;
        await mysql_access.query(sql, null);
        sql = "SELECT * from sample_project.products where productID=last_insert_id();";
        let res = await mysql_access.query(sql, null);
        console.log(res);
        return res[0];
    },
    deleteProduct: async (args) => {
        const sql = `DELETE FROM sample_project.products where productID=${args.id}`;
        let res = await mysql_access.query(sql, null);
        console.log(res);
        return args.id;
    }

};
