const express = require('express');
const router = express.Router();
const db = require('../config/database');
const Sale = require('../models/Sale');
const Product = require('../models/Product');
const User = require('../models/User');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;


// Relations
Sale.belongsTo(User);
User.hasMany(Sale);

// Get product list
router.get('/', (req, res) => {
  let odp = Sale.findAll({
    include: [{
      model: User,
      as: 'user',
      required: true,
      attributes: ['first_name']
    }],
    attributes: ['price']
  });

  User.findAll({
    attributes: ['first_name']
  });

  odp.then(mtable => {
      res.render('sales', {
        mtable
      })
    })
    .catch(err => res.render('error', {
      error: err
    }))
});

module.exports = router;