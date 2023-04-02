require('dotenv').config()

var express = require('express');
var session = require('express-session');
const indexRouter = require('./indexRoutes');
const {game_router} = require('./game_router')
const UserDatabase = require('./UserDatabase')
const DatabaseInterface = require("./DatabaseInterface.js");


var app = express();
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(session({
  secret: process.env.SESSION_SECRET_KEY,
  resave: false,
  saveUninitialized: false
}));

const userDatabase = new UserDatabase();
app.set('user_database', userDatabase);
const database_interface = new DatabaseInterface();
app.set('database_interface', database_interface);

app.use('/', indexRouter);
app.use('/game', game_router);
app.listen(3000);
