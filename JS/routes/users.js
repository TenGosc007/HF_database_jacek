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
  User.findAll({
    attributes: ['id','first_name', 'last_name', 'position'],
    include: [{
      model: Month,
      as: 'month',
      required: false,
      attributes: ['month_name', 'month_year', 'total_product'],
      order: ['month_name']
    }],
    order: ['first_name']
  }).then(users => {

    let odp = new Array(users.length);
    for(let i=0; i<users.length; i++) {
      odp[i] = {
        id: users[i].dataValues.id,
        first_name: users[i].dataValues.first_name,
        last_name: users[i].dataValues.last_name,
        position: users[i].dataValues.position,
        month_name: users[i].dataValues.month.dataValues.month_name,
        month_year: users[i].dataValues.month.dataValues.month_year,
        total_product: users[i].dataValues.month.dataValues.total_product
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
      finArr[i] = new Array(6);
    }

    let j=0;
    let k=0;
    for(i in odp) {
      if (k >= 3){ j++; k=0; }
      if(odp[i].month_name === month_1) {
        finArr[j][0] = odp[i].first_name;
        finArr[j][1] = odp[i].last_name;
        finArr[j][2] = odp[i].position;
        finArr[j][3] = odp[i].total_product;
        k++;
      }
      if(odp[i].month_name === month_2) {
        finArr[j][4] = odp[i].total_product;
        k++;
      }
      if(odp[i].month_name === month_3) {
        finArr[j][5] = odp[i].total_product;
        k++;
      }
    }

    Display.destroy({ truncate : true, cascade: false });
    for (i in finArr){
      first_name = finArr[i][0];
      last_name = finArr[i][1];
      position = finArr[i][2];
      total_product_1 = finArr[i][3];
      total_product_2 = finArr[i][4];
      total_product_3 = finArr[i][5];
      Display.create({
        first_name,
        last_name,
        position,
        total_product_1,
        total_product_2,
        total_product_3
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

  Display.findAll()
    .then(display =>{
      res.render('users', {
          display,
          month_1
      })
    })
    .catch(err => res.render('error', {error: err}))
});
    

// Display add user form
router.get('/add', (req, res) => res.render('add'));

// Add a user
router.post('/add', (req, res) => {
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

    // Insert into table
    User.create({
        first_name,
        position,
        last_name
      })
      .then(user => res.redirect('/users'))
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