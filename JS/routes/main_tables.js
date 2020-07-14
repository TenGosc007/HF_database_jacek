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
router.get('/:id', (req, res) => {
  let odp = Sale.findAll({
    attributes: ['month_name', 'price' ],
    include: [{
      model: User,
      as: 'user',
      required: true,
      attributes: ['first_name', 'last_name'],
      where: {
        id: req.params.id
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
      userId: req.params.id
    }
  }).then(sum => total = sum);

  odp.then(mtable => {
      res.render('mtable', {
        mtable, total
      })
    })
    .catch(err => res.render('error', {
      error: err
    }));
});

module.exports = router;