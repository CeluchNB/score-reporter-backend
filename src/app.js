const express = require('express');
const passport = require('passport');
require('./db/mongoose');
const userRouter = require('./routers/user');

const app = express();
app.use(express.json());
app.use(passport.initialize());
require('./middleware/auth')(passport);
app.use(userRouter);

module.exports = app;