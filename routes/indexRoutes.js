const express = require('express')
var path = require('path');
const indexRouter = express.Router();
const queueMatch = require("../utils/queueMatch.js");


indexRouter.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

indexRouter.post('/login', (req, res) => {
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

indexRouter.get('/signup_form', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/signup.html'));
});

indexRouter.post('/signup', (req, res) => {
  const userDatabase = req.app.get('user_database');
  userDatabase.newUser(req.body.username, req.body.password);
  res.redirect('/');
})

indexRouter.get('/play', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/chess.html'));
});

indexRouter.get('/new_match', (req, res) => {
  queueMatch(req, res, req.app.get('database_interface'));
});


module.exports = indexRouter;
