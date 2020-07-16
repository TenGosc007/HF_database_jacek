const express = require('express');
const router = express.Router();
const db = require('../config/database');
const Sale = require('../models/Sale');
const Product = require('../models/Product');
const User = require('../models/User');
const DisplayArr = require('../models/DisplayArr');
const Sequelize = require('sequelize');
const sequelize = require('sequelize');
const Op = Sequelize.Op;


// Relations
Sale.belongsTo(User);
Sale.belongsTo(Product);
User.hasMany(Sale);
Product.hasMany(Sale);

// Get product list
router.get('/display/:id', (req, res) => {
  let totalAll = 1;
  Sale.sum('price', {
    where: {
      userId: req.params.id
    }
  }).then(sum => {
    totalAll = sum
  });

  Sale.findAll({
    attributes: ['month_name', 'month_year', 'amount', 'price' ],
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
  }).then(mtable => {

    let odp = new Array(mtable.length);
    for(let i=0; i<mtable.length; i++) {
      odp[i] = {
        order: i,
        first_name: mtable[i].dataValues.user.dataValues.first_name,
        last_name: mtable[i].dataValues.user.dataValues.last_name,
        month_name: mtable[i].month_name,
        month_number: i,
        month_year: mtable[i].month_year,
        product_name: mtable[i].dataValues.product.dataValues.product_name,
        amount: mtable[i].amount,
        price: mtable[i].price,
        total: 0
      }
    }

    // Change month name to number
    for(i in odp) {
      odp[i].month_number = month_day(odp[i].month_name);
    }

    // Sort by product name
    odp.sort(function(a, b){
      return a.product_name.localeCompare(b.product_name);
    });

    // Sort by month
    odp.sort(function(a, b){
      return b.month_number - a.month_number;
    });

    // Sort by year
    odp.sort(function(a, b){
      return b.month_year - a.month_year;
    });

    // Compute total sale of month
    odp[0].total = odp[0].price;
    for(i in odp) {
      odp[i].order = i;    // change order
      if (i==0) continue;
      odp[i].total = odp[i].price;
      if (odp[i].month_number === odp[i-1].month_number && odp[i].month_year === odp[i-1].month_year) {
        odp[i].total = odp[i].total + odp[i-1].total;
        odp[i-1].total = -1;
        odp[i].month_number = -1;
        odp[i].month_year = -1;
      }
    } 

    console.log(odp)

    DisplayArr.destroy({ truncate : true, cascade: false });
    for (i in odp){
      order = odp[i].order;
      first_name = odp[i].first_name;
      last_name = odp[i].last_name;
      month_name = odp[i].month_name;
      month_number = odp[i].month_number;
      month_year = odp[i].month_year;
      product_name = odp[i].product_name;
      amount = odp[i].amount;
      price = odp[i].price;
      total = odp[i].total;
      DisplayArr.create({
        order,
        first_name,
        last_name,
        month_name,
        month_number,
        month_year,
        product_name,
        amount,
        price,
        total
      })
    }
    if(!totalAll) {totalAll = 0;}
    res.redirect('/mtable/total')
  })
  .catch(err => res.render('error', {
    error: err
  }));
});

// Display table with details
router.get('/total', (req, res) => {
  DisplayArr.findAll({order: ['order']})
    .then(mtable =>{
      res.render('mtable', {
          mtable
      })
    })
    .catch(err => res.render('error', {error: err}))
});

const month_day = (month) => {
  switch (month) {
    case 'Styczeń':
      return 1;
      break;
    case 'Luty':
      return 2;
      break;
    case 'Marzec':
      return 3;
      break;
    case 'Kwiecień':
      return 4;
      break;
    case 'Maj':
      return 5;
      break;
    case 'Czerwiec':
      return 6;
      break;
    case 'Lipiec':
      return 7;
      break;
    case 'Sierpień':
      return 8;
      break;
    case 'Wrzesień':
      return 9;
      break;
    case 'Październik':
      return 10;
      break;
    case 'Listopad':
      return 11;
      break;
    case 'Grudzień':
      return 12;
      break;
    default:
      return "ERROR";
  }
};

module.exports = router;