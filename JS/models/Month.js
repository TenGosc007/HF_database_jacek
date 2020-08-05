const Sequelize = require('sequelize');
const User = require('../models/User');
const db = require('../config/database');

const Month = db.define('month', {
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
  total_product: {
    type: Sequelize.FLOAT
  },
  total_carnet: {
    type: Sequelize.FLOAT
  }
});

Month.sync().then(() => {
  console.log('table month created');
});
module.exports = Month;