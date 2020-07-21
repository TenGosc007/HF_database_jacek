const express = require('express');
const exphbs = require('express-handlebars');
const Handlebars = require('handlebars');
const {
  allowInsecurePrototypeAccess
} = require('@handlebars/allow-prototype-access');
const bodyParser = require('body-parser');
const path = require('path');
const Product = require('../JS/models/Product');
let boleanVar = true;

// Database
const db = require('./config/database');
const { and } = require('./config/database');

// Test DB
db.authenticate()
  .then(() => console.log('Database connected...'))
  .catch(err => console.log('Error: ' + err))

const app = express();

// Handlebars
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// My handlebrars helpers
Handlebars.registerHelper('isEven', function (value) {
  if (value % 2 == 0)
    return true;
  else
    return false;
});

Handlebars.registerHelper('ifPos', function (val1, val2) {
  if (val1 === val2)
    return true;
  else
    return false;
});

Handlebars.registerHelper('ifNot', function (val1, val2) {
  if (val1 === val2)
    return false;
  else
    return true;
});

Handlebars.registerHelper('change', function () {
  if (boleanVar === true){
    boleanVar = false;
    return true;
  }
  else{
    boleanVar = true;
    return false;
  }
});

Handlebars.registerHelper('actual', function (month, year) {
  const dateObj = new Date();
  let mindex = dateObj.getUTCMonth();
  let currentYear = dateObj.getUTCFullYear();
  let monthTab = ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'];
  if (month === monthTab[mindex] && year == currentYear)
    return true;
  else
    return false;
});

Handlebars.registerHelper('prev', function (month, year) {
  const dateObj = new Date();
  let mindex = dateObj.getUTCMonth()-1;
  let currentYear = dateObj.getUTCFullYear();
  if (mindex < 0) { mindex = 12 + mindex; currentYear = currentYear-1}
  let monthTab = ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'];
  if (month === monthTab[mindex] && year == currentYear)
    return true;
  else
    return false;
});

Handlebars.registerHelper('pprev', function (month, year) {
  const dateObj = new Date();
  let mindex = dateObj.getUTCMonth()-2;
  let currentYear = dateObj.getUTCFullYear();
  if (mindex < 0) { mindex = 12 + mindex; currentYear = currentYear-1}
  let monthTab = ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'];
  if (month === monthTab[mindex] && year == currentYear)
    return true;
  else
    return false;
});

// Body Parser
app.use(bodyParser.urlencoded({
  extended: false
}));

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Index route
app.get('/', (req, res) => res.render('index', {
  layout: 'landing'
}));

// User routes
app.use('/users', require('./routes/users'));

// Product routes
app.use('/products', require('./routes/products'));

// Sale routes
app.use('/summary', require('./routes/summary'));

// Main table
app.use('/mtable', require('./routes/main_tables'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));