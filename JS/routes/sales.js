const express = require('express');
const router = express.Router();
const db = require('../config/database');
const Sale = require('../models/Sale');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

// Get product list
router.get('/', (req, res) => 
  Sale.findAll()
    .then(sales => res.render('sales', {
        sales
      }))
    .catch(err => res.render('error', {error: err})));

module.exports = router;