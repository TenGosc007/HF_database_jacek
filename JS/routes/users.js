const express = require('express');
const router = express.Router();
const db = require('../config/database');
const User = require('../models/User');
const Sale = require('../models/Sale');
const Month = require('../models/Month');
const Display = require('../models/Display');
const Sequelize = require('sequelize');
const { count } = require('../models/Display');
const Op = Sequelize.Op;

// Relations
User.belongsTo(Month, {
  foreignKey: 'id',
  targetKey: 'userId'
});
Month.hasMany(User, {
  primaryKey: 'userId'
});

// Get user list
router.get('/', (req, res) => {
  const dateObj = new Date();
  let month = dateObj.getUTCMonth() + 1;
  let year = dateObj.getUTCFullYear();
  month_1 = month_day(month);
  month_2 = month_day(month - 1);
  month_3 = month_day(month - 2);

  User.findAll({
    attributes: ['id','first_name', 'last_name', 'position'],
    include: [{
      model: Month,
      as: 'month',
      required: false,
      attributes: ['month_name', 'month_year', 'total_product', 'total_carnet'],
    }],
    order: ['first_name']
  }).then(users => {

    let odp = new Array(users.length);
    for(let i=0; i<users.length; i++) {

      // Create new column for user, when next month arrived
      Month.findAll({
        where: {
          userId: users[i].dataValues.id,
          month_name: month_1,
          month_year: year
        }
      })
      .then(odp => {
        if(!odp[0]){
          Month.create({
            month_name: month_1,
            month_year: year,
            userId: users[i].dataValues.id,
            total_product: 0,
            total_carnet: 0
          });
        }
      });

      odp[i] = {
        id: users[i].dataValues.id,
        first_name: users[i].dataValues.first_name,
        last_name: users[i].dataValues.last_name,
        position: users[i].dataValues.position,
        month_name: users[i].dataValues.month.dataValues.month_name,
        month_year: users[i].dataValues.month.dataValues.month_year,
        total_product: users[i].dataValues.month.dataValues.total_product,
        total_carnet: users[i].dataValues.month.dataValues.total_carnet
      }
    }

    let coutner = 1;
    for(i in odp){
      if(i==0) continue;
      if (odp[i].id !== odp[i-1].id)
      coutner++;
    }
    var finArr = new Array(coutner);
    for (var i = 0; i < finArr.length; i++) {
      finArr[i] = new Array(10);
    }

    let j=0;
    let k=0;
    for(i in odp) {
      if (k >= 3){ j++; k=0; }
      if(odp[i].month_name === month_1) {
        finArr[j][0] = odp[i].id;
        finArr[j][1] = odp[i].first_name;
        finArr[j][2] = odp[i].last_name;
        finArr[j][3] = odp[i].position;
        finArr[j][4] = odp[i].total_product;
        finArr[j][5] = odp[i].total_carnet;
        k++;
      }
      if(odp[i].month_name === month_2) {
        finArr[j][6] = odp[i].total_product;
        finArr[j][7] = odp[i].total_carnet;
        k++;
      }
      if(odp[i].month_name === month_3) {
        finArr[j][8] = odp[i].total_product;
        finArr[j][9] = odp[i].total_carnet;
        k++;
      }
    }
    
    // Total sum
    let totalSum_product_1 = 0;
    let totalSum_carnet_1 = 0;
    let totalSum_product_2 = 0;
    let totalSum_carnet_2 = 0;
    let totalSum_product_3 = 0;
    let totalSum_carnet_3 = 0;

    Display.destroy({ truncate : true, cascade: false });
    for (i in finArr){
      userId = finArr[i][0]
      first_name = finArr[i][1];
      last_name = finArr[i][2];
      position = finArr[i][3];
      total_product_1 = finArr[i][4];
      total_carnet_1 = finArr[i][5];
      total_product_2 = finArr[i][6];
      total_carnet_2 = finArr[i][7];
      total_product_3 = finArr[i][8];
      total_carnet_3 = finArr[i][9];

      if (finArr[i][0] != 1) {
        totalSum_product_1 += total_product_1;
        totalSum_carnet_1 += total_carnet_1;
        totalSum_product_2 += total_product_2;
        totalSum_carnet_2 += total_carnet_2;
        totalSum_product_3 += total_product_3;
        totalSum_carnet_3 += total_carnet_3;
      }
      
      Display.create({
        userId,
        first_name,
        last_name,
        position,
        total_product_1,
        total_carnet_1,
        total_product_2,
        total_carnet_2,
        total_product_3,
        total_carnet_3,

        totalSum_product_1,
        totalSum_carnet_1,
        totalSum_product_2,
        totalSum_carnet_2,
        totalSum_product_3,
        totalSum_carnet_3
      })
    }

    res.redirect('/users/display');

  }).catch(err => res.render('error', {
    error: err.message
  }))
});

// Display table
router.get('/display', (req, res) => {
  const dateObj = new Date();
  let month = dateObj.getUTCMonth() + 1;
  let year = dateObj.getUTCFullYear();
  month_1 = month_day(month);
  month_2 = month_day(month - 1);
  month_3 = month_day(month - 2);

  Display.findAll({order: ['first_name']})
    .then(display =>{
      res.render('users', {
          display,
          month_1,
          month_2,
          month_3
      })
    })
    .catch(err => res.render('error', {error: err}))
});

// Display add user form
router.get('/add', (req, res) => res.render('add'));

// Add a user
router.post('/add', (req, res) => {
  const first_month = 3;
  const first_year = 2020;
  const dateObj = new Date();
  let month = dateObj.getUTCMonth() + 1;
  let year = dateObj.getUTCFullYear();
  let total_product = 0;
  let total_carnet = 0;
  let userId = 0;

  let {
    first_name,
    position,
    last_name
  } = req.body;
  let errors = [];

  // Validate Fields
  if (!first_name) {
    errors.push({
      text: 'Pojaj imię'
    });
  }
  if (!position) {
    position = 'klient';
  }
  if (!last_name) {
    errors.push({
      text: 'Podaj nazwisko'
    });
  }

  // Check for errors
  if (errors.length > 0) {
    res.render('add', {
      errors,
      first_name,
      position,
      last_name
    });
  } else {
    // Make lowercase and remove space after comma
    position = position.toLowerCase().replace(/,[ ]+/g, ',');

    year = year - (year - first_year);

    // Insert into table
    User.create({
        first_name,
        position,
        last_name
      })
      .then(user => { 
        User.max('id')
        .then(val => {
          userId = val;
          while (true) {
            month_year = year;
            month_name = month_day(month);
            productId = 1;
            price = 0;
            amount = 0;
            total = 0;
      
            Month.create({
              month_name,
              month_year,
              userId,
              total_product,
              total_carnet
            });

            Sale.create(({
              month_name,
              month_year,
              userId,
              productId,
              price,
              amount,
              total
            }));
      
            month = month-1;
            if(month < 1) {
              month = 12;
              year = year - 1;
            } 
      
            if(month === first_month && year === first_year)
              break;
          }
        });
      
        res.redirect('/users')
    })
      .catch(err => res.render('error', {
        error: err.message
      }))
  }
});

// Search for users
router.get('/search', (req, res) => {
  let {
    term
  } = req.query;

  // Make lowercase
  term = term.toLowerCase();

  User.findAll({
      where: {
        position: {
          [Op.like]: '%' + term + '%'
        }
      }
    })
    .then(users => res.render('users', {
      users
    }))
    .catch(err => res.render('error', {
      error: err
    }));
});

const month_day = (month) => {
  if (month <= 0) {
    month = 12 + month;
  }
  switch (month) {
    case 1:
      return 'Styczeń';
      break;
    case 2:
      return 'Luty';
      break;
    case 3:
      return 'Marzec';
      break;
    case 4:
      return 'Kwiecień';
      break;
    case 5:
      return 'Maj';
      break;
    case 6:
      return 'Czerwiec';
      break;
    case 7:
      return 'Lipiec';
      break;
    case 8:
      return 'Sierpień';
      break;
    case 9:
      return 'Wrzesień';
      break;
    case 10:
      return 'Październik';
      break;
    case 11:
      return 'Listopad';
      break;
    case 12:
      return 'Grudzień';
      break;
    default:
      return "ERROR";
  }
};

module.exports = router;