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
Sale.belongsTo(Product);
User.hasMany(Sale);
Product.hasMany(Sale);

// Get product list
router.get('/', (req, res) => {
  let odp = Sale.findAll({
    attributes: ['month_name', 'price' ],
    include: [{
      model: User,
      as: 'user',
      required: true,
      attributes: ['first_name', 'last_name'],
      where: {
        first_name: 'Adam'
      }
    }, {
      model: Product,
      as: 'product',
      required: true,
      attributes: ['product_name']
    }]
  });

  let total = 1;
  Sale.sum('price', {
    where: {
      month_name: 'july20',
      userId: 3
    }
  }).then(sum => total = sum);

  odp.then(mtable => {
      console.log(mtable[0].dataValues.user.dataValues.first_name);
      res.render('mtable', {
        mtable, total
      })
    })
    .catch(err => res.render('error', {
      error: err
    }));
});

module.exports = router;