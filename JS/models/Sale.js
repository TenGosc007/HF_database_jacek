const Sequelize = require('sequelize');
const db = require('../config/database');
const User = require('../models/User');
const Product = require('../models/Product');

const Sale = db.define('sale', {
  month_name: {
    type: Sequelize.STRING,
    primaryKey: true
  },
  userId: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    references: {
      model: User,
      key: 'id'
    }
  },
  product_id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    references: {
      model: Product,
      key: 'id'
    }
  },
  price: {
    type: Sequelize.INTEGER
  },
  amount: {
    type: Sequelize.INTEGER
  }
});


Sale.sync().then(() => {
  console.log('table sale created');
});
module.exports = Sale;