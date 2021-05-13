const express = require('express');
const passport = require('passport');
const User = require('../models/user');

const router = new express.Router();

router.post('/user', async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post('/user/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password);
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get('/user/profile', passport.authenticate('jwt', { session: false }), async (req, res) => {
  if (req.user) {
    res.status(200).send(req.user);
  } else {
    res.status(400).send({ message: 'User was not found' });
  }
});

module.exports = router;