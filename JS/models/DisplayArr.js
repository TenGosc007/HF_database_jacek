const Sequelize = require('sequelize');
const db = require('../config/database');

const DisplayArr = db.define('displayArr', {
  order: {
    type: Sequelize.INTEGER
  },
  first_name: {
    type: Sequelize.STRING
  },
  last_name: {
    type: Sequelize.STRING
  },
  userId: {
    type: Sequelize.INTEGER
  },
  month_name: {
    type: Sequelize.STRING
  },
  month_number: {
    type: Sequelize.INTEGER
  },
  month_year: {
    type: Sequelize.INTEGER
  },
  product_name: {
    type: Sequelize.STRING
  },
  amount: {
    type: Sequelize.INTEGER
  },
  price: {
    type: Sequelize.INTEGER
  },
  total: {
    type: Sequelize.INTEGER
  },
});

DisplayArr.sync().then(() => {
  console.log('table users created');
});
module.exports = DisplayArr;