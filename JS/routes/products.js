const express = require('express');
const router = express.Router();
const db = require('../config/database');
const Product = require('../models/Product');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

// Get product list
router.get('/', (req, res) =>
  Product.findAll({order: ['product_name']})
  .then(products => res.render('products', {
    products
  }))
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

module.exports = router;