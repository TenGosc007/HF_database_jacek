const Sequelize = require('sequelize');
const db = require('../config/database');

const Product = db.define('product', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  product_name: {
    type: Sequelize.STRING,
    primaryKey: true
  },
  price: {
    type: Sequelize.FLOAT
  }
});

Product.sync().then(() => {
  console.log('table products created');
});
module.exports = Product;