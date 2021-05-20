const express = require('express');
const passport = require('passport');
const User = require('./../models/user');

const router = new express.Router();

router.post('/user', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();

    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send({ message: 'Error creating user', error });
  }
});

router.post('/user/login', passport.authenticate('local', { session: false }), async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password);
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (error) {
    res.status(400).send({ message: 'Error logging in', error });
  }
});

router.get('/user/profile', passport.authenticate('jwt', { session: false }), async (req, res) => {
  res.status(200).send(req.user);
});

module.exports = router;