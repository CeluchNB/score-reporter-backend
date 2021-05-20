const express = require('express');
const passport = require('passport');
require('./db/mongoose');
const userRouter = require('./routers/user');
const teamRouter = require('./routers/team');

const app = express();
app.use(express.json());
app.use(passport.initialize());
require('./auth/config-passport');
app.use(userRouter);
app.use(teamRouter);

module.exports = app;