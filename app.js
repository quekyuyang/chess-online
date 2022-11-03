require('dotenv').config()

var express = require('express');
var session = require('express-session');
const index = require('./index');
const {game_router} = require('./game_router')
const DatabaseInterface = require("./DatabaseInterface.js");


var app = express();
app.use(express.static('public'));
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET_KEY,
  resave: false,
  saveUninitialized: false
}));

const database_interface = new DatabaseInterface();
app.set('database_interface', database_interface);

app.use('/', index);
app.use('/game', game_router);
app.listen(3000);
