require('dotenv').config()

var express = require('express');
var session = require('express-session');
const {index} = require('./index');


var app = express();
app.use(express.static('public'));
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET_KEY,
  resave: false,
  saveUninitialized: false
}));

app.use('/', index);
app.listen(3000);
