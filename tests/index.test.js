require('dotenv').config()
const DatabaseInterface = require("../DatabaseInterface.js")
jest.mock("../DatabaseInterface.js")

const {index, update_opponent} = require("../index");
const request = require("supertest");
const express = require("express");
var session = require('express-session');
const app = express();


app.use(session({
  secret: process.env.SESSION_SECRET_KEY,
  resave: false,
  saveUninitialized: false
}));
app.get('*', (req, res, next) => {
  req.session.match_id = 'match_id'
  next()
})
app.use("/", index);

test("Get match state", done => {
  request(app)
  .get("/match_state")
  .expect({foo: 'bar'}, done)

  const interval_id = setInterval(() => {
    const success = update_opponent('match_id', {foo: 'bar'})
    if (success) {
      clearInterval(interval_id)
    }
  }, 50)
})
