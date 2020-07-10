const express = require('express');
const router = express.Router();
const db = require('../config/database');
const User = require('../models/User');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

// Get user list
router.get('/', (req, res) => 
  User.findAll()
    .then(users => res.render('users', {
        users
      }))
    .catch(err => res.render('error', {error: err})));

// Display add user form
router.get('/add', (req, res) => res.render('add'));

// Add a user
router.post('/add', (req, res) => {
  let { first_name, position, last_name } = req.body;
  let errors = [];

  // Validate Fields
  if(!first_name) {
    errors.push({ text: 'Please add a first_name' });
  }
  if(!position) {
    errors.push({ text: 'Please add some position' });
  }
  if(!last_name) {
    errors.push({ text: 'Please add a last_name' });
  }

  // Check for errors
  if(errors.length > 0) {
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
      .catch(err => res.render('error', {error:err.message}))
  }
});

// Search for users
router.get('/search', (req, res) => {
  let { term } = req.query;

  // Make lowercase
  term = term.toLowerCase();

  User.findAll({ where: { position: { [Op.like]: '%' + term + '%' } } })
    .then(users => res.render('users', { users }))
    .catch(err => res.render('error', {error: err}));
});

module.exports = router;