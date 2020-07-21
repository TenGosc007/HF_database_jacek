const express = require('express');
const router = express.Router();
const db = require('../config/database');
const Product = require('../models/Product');
const Sale = require('../models/Sale');
const Sequelize = require('sequelize');
const { search } = require('./users');
const Op = Sequelize.Op;

// Get product list
router.get('/', (req, res) =>
  Product.findAll({order: ['product_name']})
  .then(products =>{ 
    Product.findAll()
    .then(odp => {
      if(!odp[0])
        Product.create({
          product_name: 'NULL',
          price: 0
        })
    });
    res.render('products', {
    products
  })
})
  .catch(err => res.render('error', {
    error: err
  })));

// Display add product form
router.get('/addpr', (req, res) => res.render('addpr'));

// Add a product
router.post('/addpr', (req, res) => {
  let {
    product_name,
    price
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
    res.render('add', {
      errors,
      product_name,
      price
    });
  } else {
    // Insert into table
    Product.create({
        product_name,
        price
      })
      .then(product => res.redirect('/products'))
      .catch(err => res.render('error', {
        error: err.message
      }))
  }
});

// Get product list
router.get('/editproduct/:id/:err', (req, res) =>
  Product.findAll({where: {id: req.params.id}})
  .then(products =>{
    const err = req.params.err;
    res.render('editproduct', {
      products, err
    })
  })
  .catch(err => res.render('error', {
    error: err
  })));
  
// Display erase product form
router.get('/errproduct', (req, res) => res.render('/products'));

// Erase a product
router.post('/errproduct/:id', (req, res) => {
  Sale.findAll({where: {productId: req.params.id}})
  .then(odp => {
    if(odp[0]) {
      res.redirect(`/products/editproduct/${req.params.id}/1`)
    } else {
      Product.destroy({
        where: {
            id: req.params.id
        }
      }).then(res.redirect("/products"))
      .catch(err => res.render('error', {
        error: err.message
      }));
    } 
  })
});

// Add a product
router.post('/editproduct/:id/:err', (req, res) => {
  let {
    product_name,
    price
  } = req.body;

  // Insert into table
  Product.update({ 
    product_name,
    price
  }, {
    where: {
      id: req.params.id
    }
  })
  .then(result => {
    console.log("Table Product Updated");
    res.redirect("/products");
  }
  )
  .catch(err => console.log(err))
});

module.exports = router;