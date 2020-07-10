const Sequelize = require('sequelize');
const db = require('../config/database');

const Product = db.define('product', {
  product_name: {
    type: Sequelize.STRING
  },
  price: {
    type: Sequelize.INTEGER
  }
});

Product.sync().then(() => {
  console.log('table products created');
});
module.exports = Product;