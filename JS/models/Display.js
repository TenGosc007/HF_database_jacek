const Sequelize = require('sequelize');
const db = require('../config/database');

const Display = db.define('display', {
  userId: {
    type: Sequelize.INTEGER
  },
  first_name: {
    type: Sequelize.STRING
  },
  last_name: {
    type: Sequelize.STRING
  },
  position: {
    type: Sequelize.STRING
  },
  total_product_1: {
    type: Sequelize.INTEGER
  },
  total_carnet_1: {
    type: Sequelize.INTEGER
  },
  total_product_2: {
    type: Sequelize.INTEGER
  },
  total_carnet_2: {
    type: Sequelize.INTEGER
  },
  total_product_3: {
    type: Sequelize.INTEGER
  },
  total_carnet_3: {
    type: Sequelize.INTEGER
  },
  totalSum_product_1: {
    type: Sequelize.INTEGER
  },  
  totalSum_carnet_1: {
    type: Sequelize.INTEGER
  },
  totalSum_product_2: {
    type: Sequelize.INTEGER
  },  
  totalSum_carnet_2: {
    type: Sequelize.INTEGER
  },
  totalSum_product_3: {
    type: Sequelize.INTEGER
  },  
  totalSum_carnet_3: {
    type: Sequelize.INTEGER
  },
});

Display.sync().then(() => {
  console.log('table users created');
});
module.exports = Display;