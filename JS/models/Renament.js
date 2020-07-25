const Sequelize = require('sequelize');
const db = require('../config/database');

const Renament = db.define('renament', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  product_name: {
    type: Sequelize.STRING,
    primaryKey: true
  },
  amount: {
    type: Sequelize.INTEGER
  },
  price: {
    type: Sequelize.INTEGER
  }
});

Renament.sync().then(() => {
  console.log('table renaments created');
});
module.exports = Renament;