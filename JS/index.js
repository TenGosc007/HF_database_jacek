const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path');

// Database
const db = require('./config/database');

const app = express();

// Handlebars
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Connect
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('MySql Connected...');
});

app.get('/users', (req, res) => {
    res.render('users', {users});
});

// Create DB
app.get('/createdb', (req, res) => {
    let sql = 'CREATE DATABASE jahl';
    db.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send('Database created...');
    });
});

// Create table
app.get('/createusers', (req, res) => {
    let sql = `CREATE TABLE users(
        user_id INT AUTO_INCREMENT,
        first_name VARCHAR(100),
        last_name VARCHAR(100),
        position VARCHAR(40),
        PRIMARY KEY(user_id)
     )`;
    db.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send('Post table created...');
    });
});

// Insert user
app.get('/adduser', (req, res) => {
    let user = {
        first_name: 'Arkadiusz',
        last_name: 'Atamańczuk',
        position: 'Supervisor'
    };
    let sql = 'INSERT INTO users SET ?';
    let query = db.query(sql, user, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send(`User ${user.first_name} added...`);
    });
})

// Select users 
app.get('/getusers', (req, res) => {
    let sql = 'SELECT * FROM users';
    let query = db.query(sql, (err, results) => {
        if (err) throw err;
        console.log('Users fetched...')
        res.send(results);
    });
});

// Select single user
app.get('/getuser/:id', (req, res) => {
    let sql = `SELECT * FROM users WHERE user_id = ${req.params.id}`;
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        console.log('User fetched...')
        res.send(result);
    });
});

// Update user
app.get('/updateuser/:id/:position', (req, res) => {
    let sql = `UPDATE users SET position = '${req.params.position}' WHERE user_id = ${req.params.id}`;
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        console.log('User updated...')
        res.send(result);
    });
});

// Delete user
app.get('/deleteuser/:id', (req, res) => {
    let sql = `DELETE FROM users WHERE user_id = ${req.params.id}`;
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        console.log('User deleted...')
        res.send(result);
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));