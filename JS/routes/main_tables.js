const express = require('express');
const router = express.Router();
const db = require('../config/database');
const Sale = require('../models/Sale');
const Product = require('../models/Product');
const User = require('../models/User');
const Month = require('../models/Month');
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
        userId: req.params.id,
        month_name: mtable[i].month_name,
        month_number: i,
        month_year: mtable[i].month_year,
        product_name: mtable[i].dataValues.product.dataValues.product_name,
        amount: mtable[i].amount,
        price: mtable[i].price,
        total_product: 0,
        total_carnet: 0
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
    if(odp[0].product_name == 'Karnet' || odp[0].product_name == 'Karnet_XL')
      odp[0].total_carnet = odp[0].price;
    else
      odp[0].total_product = odp[0].price;

    // Update Month table
    Month.update({ 
      total_product: odp[0].total_product,
      total_carnet: odp[0].total_carnet
    }, {
      where: {
        month_name: odp[0].month_name,
        month_year: odp[0].month_year,
        userId: odp[0].userId
      }
    })
    .then(result => 
      console.log("Table Month Updated")
    )
    .catch(err => console.log(err))

    for(i in odp) {
      odp[i].order = i;    // change order
      if (i==0) continue;

      if(odp[i].product_name == 'Karnet' || odp[i].product_name == 'Karnet_XL') {
        odp[i].total_carnet = odp[i].price;

        if (odp[i].month_name === odp[i-1].month_name && odp[i].product_name != "NULL"
          && odp[i].month_year === odp[i-1].month_year) {
          odp[i].total_product = odp[i].total_product + odp[i-1].total_product;
          odp[i].total_carnet = odp[i].total_carnet + odp[i-1].total_carnet;
          odp[i-1].total_product = -1;
          odp[i-1].total_carnet = -1;
          odp[i].month_number = -1;
          Month.update({ 
            total_product: odp[i].total_product,
            total_carnet: odp[i].total_carnet
          }, {
            where: {
              month_name: odp[i].month_name,
              month_year: odp[i].month_year,
              userId: odp[i].userId
            }
          })
          .then(result => 
            console.log("Table Month Updated")
          )
          .catch(err => console.log(err))
        }
      }
      else {
        odp[i].total_product = odp[i].price;

        if (odp[i].month_name === odp[i-1].month_name && odp[i].product_name != "NULL"
          && odp[i].month_year === odp[i-1].month_year) {
          odp[i].total_product = odp[i].total_product + odp[i-1].total_product;
          odp[i].total_carnet = odp[i].total_carnet + odp[i-1].total_carnet;
          odp[i-1].total_product = -1;
          odp[i-1].total_carnet = -1;
          odp[i].month_number = -1;
          Month.update({ 
            total_product: odp[i].total_product,
            total_carnet: odp[i].total_carnet
          }, {
            where: {
              month_name: odp[i].month_name,
              month_year: odp[i].month_year,
              userId: odp[i].userId
            }
          })
          .then(result => 
            console.log("Table Month Updated")
          )
          .catch(err => console.log(err))
        }
      }
    } 

    DisplayArr.destroy({ truncate : true, cascade: false });
    for (i in odp){
      order = odp[i].order;
      first_name = odp[i].first_name;
      last_name = odp[i].last_name;
      userId = odp[i].userId;
      month_name = odp[i].month_name;
      month_number = odp[i].month_number;
      month_year = odp[i].month_year;
      product_name = odp[i].product_name;
      amount = odp[i].amount;
      price = odp[i].price;
      total_product = odp[i].total_product;
      total_carnet = odp[i].total_carnet;
      DisplayArr.create({
        order,
        first_name,
        last_name,
        userId,
        month_name,
        month_number,
        month_year,
        product_name,
        amount,
        price,
        total_product,
        total_carnet
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
  const dateObj = new Date();
  let month = dateObj.getUTCMonth() + 1;
  let year = dateObj.getUTCFullYear();
  month_1 = month_to_day(month);
  DisplayArr.findAll({order: ['order']})
    .then(mtable =>{
      Product.findAll({order: ['product_name']}).
      then(products => {
        res.render('mtable', {
          mtable, products, year, month_1
        })
      })
    })
    .catch(err => res.render('error', {error: err}))
});

// Display add product form
router.get('/addnew', (req, res) => res.render('addnew'));

// Add a user
router.post('/addnew', (req, res) => {
  let {
    userId,
    product_name,
    price,
    amount,
    month_name,
    month_year
  } = req.body;
  let errors = [];
  
  // Validate Fields
  if (!product_name) {
    errors.push({
      text: 'Pojaj nazwę'
    });
  }
  if (!price) {
    errors.push({
      text: 'Podaj cenę'
    });
  }

  // Check for errors
  if (errors.length > 0) {
    res.render('addnew', {
      errors: 'test',
      product_name,
      price
    });
  } else {
    // Insert into table
    Product.findAll({
      attributes: ['id'],
      where: {
        product_name: product_name
      }
    }).then(products => {
      productId = products[0].dataValues.id;
      console.log(month_name, month_year, userId, productId, price, amount);
      Sale.create({
        month_name,
        month_year,
        userId,
        productId,
        price,
        amount
      })
      .then(product => {
        res.redirect(`/mtable/display/${userId}`)
      })
      .catch(err => res.render('error', {
        error: err.message
      }))
    })
  }
});

// Display erase product form
router.get('/erruser', (req, res) => res.render('/users/display'));

// Erase a user
router.post('/erruser/:id', (req, res) => {
  console.log(req.params.id)
  Month.destroy({
      where: {
          userId: req.params.id
      }
  });
  Sale.destroy({
    where: {
        userId: req.params.id
    }
  });
  User.destroy({
    where: {
        id: req.params.id
    }
  })
  res.redirect("/users")
});

// Get product list
router.get('/editmtable/:id', (req, res) =>
  DisplayArr.findAll({where: {id: req.params.id}})
  .then(products =>{
    res.render('editmtable', {
      products
    })
  })
  .catch(err => res.render('error', {
    error: err
  })));

// Display erase product form
router.get('/errmtable', (req, res) => res.render('/mtable'));

// Erase a product
router.post('/errmtable/:year/:month/:user/:product', (req, res) => {
  console.log('test: ', req.params.year, req.params.month, req.params.user, req.params.product)
  Product.findAll({where: {product_name: req.params.product}})
  .then(prod => {
    Sale.destroy({
      where: {
        month_year: req.params.year,
        month_name: req.params.month,
        userId: req.params.user,
        productId: prod[0].dataValues.id
      }
    }).then(odp => {
      if(req.params.product == "Karnet" || req.params.product == "Karnet_XL"){
        Month.update({
          total_carnet: 0, 
        },{
          where: {
            month_name: req.params.month,
            month_year: req.params.year,
            userId: req.params.user
          }
        }).then(res.redirect(`/mtable/display/${req.params.user}`))
      }else {
        Month.update({
          total_product: 0, 
        },{
          where: {
            month_name: req.params.month,
            month_year: req.params.year,
            userId: req.params.user
          }
        }).then(res.redirect(`/mtable/display/${req.params.user}`))
      }
    })
  })
});

// Add a product
router.post('/editmtable/:id', (req, res) => {
  let {
    amount,
    price,
    product_name,
    userId,
    month_name,
    month_year
  } = req.body;

  // Insert into table
  Product.findAll({attributes: ['id'], where: {product_name}})
  .then(odp => {
    Sale.update({ 
      amount,
      price
    }, {
      where: {
        month_name,
        month_year,
        userId,
        productId: odp[0].dataValues.id
      }
    })
    .then(result => {
      console.log("Table Mtable Updated");
      res.redirect(`/mtable/display/${userId}`);
    }
    )
    .catch(err => console.log(err))
  });
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

const month_to_day = (month) => {
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