const Sequelize = require('sequelize');
const db = require('../config/database');

const User = db.define('user', {
  first_name: {
    type: Sequelize.STRING
  },
  position: {
    type: Sequelize.STRING
  },
  last_name: {
    type: Sequelize.STRING
  }
});

User.sync().then(() => {
  console.log('table users created');
});
module.exports = User;