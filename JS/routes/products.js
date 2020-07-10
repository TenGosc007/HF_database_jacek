const express = require('express');
const router = express.Router();
const db = require('../config/database');
const Product = require('../models/Product');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

// Get product list
router.get('/', (req, res) => 
  Product.findAll()
    .then(products => res.render('products', {
        products
      }))
    .catch(err => res.render('error', {error: err})));

module.exports = router;