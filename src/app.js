const express = require('express');
const passport = require('passport');
require('./db/mongoose');
const userRouter = require('./routers/user');
const teamRouter = require('./routers/team');
const seasonRouter = require('./routers/season');

const app = express();
app.use(express.json());
app.use(passport.initialize());
require('./auth/config-passport');
app.use(userRouter);
app.use(teamRouter);
app.use(seasonRouter);

module.exports = app;