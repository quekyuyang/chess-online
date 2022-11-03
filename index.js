const express = require('express')
var path = require('path');
const index = express.Router();
const queue_match = require("./helper.js");


let waiting = null;

index.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'chess.html'));
});

index.get('/new_match', (req, res) => {
  queue_match(req, res, req.app.get('database_interface'));
});


module.exports = index;
