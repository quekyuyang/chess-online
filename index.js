const express = require('express')
var path = require('path');
const index = express.Router();
const queueMatch = require("./helper.js");


let waiting = null;

index.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

index.post('/login', (req, res) => {
  const userDatabase = req.app.get('user_database');
  userDatabase.authenticate(req.body.username, req.body.password)
  .then((success) => {
    if (success) {
      req.session.username = req.body.username
      res.redirect('/play')
    }
    else
      res.redirect('/')
  })
})

index.get('/signup_form', (req, res) => {
  res.sendFile(path.join(__dirname, 'signup.html'));
});

index.post('/signup', (req, res) => {
  const userDatabase = req.app.get('user_database');
  userDatabase.newUser(req.body.username, req.body.password);
  res.redirect('/');
})

index.get('/play', (req, res) => {
  res.sendFile(path.join(__dirname, 'chess.html'));
});

index.get('/new_match', (req, res) => {
  queueMatch(req, res, req.app.get('database_interface'));
});


module.exports = index;
