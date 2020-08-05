const Sequelize = require('sequelize');
const db = require('../config/database');
const User = require('../models/User');
const Product = require('../models/Product');
const { STRING } = require('sequelize');

const Sale = db.define('sale', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  month_name: {
    type: Sequelize.STRING,
    primaryKey: true
  },
  month_year: {
    type: Sequelize.INTEGER,
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
  productId: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    references: {
      model: Product,
      key: 'id'
    }
  },
  price: {
    type: Sequelize.FLOAT
  },
  amount: {
    type: Sequelize.INTEGER
  },
  total: {
    type: Sequelize.INTEGER
  }
});


Sale.sync().then(() => {
  console.log('table sale created');
});
module.exports = Sale;