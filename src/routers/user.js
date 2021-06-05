const express = require('express');
const passport = require('passport');
const User = require('./../models/user');

const router = new express.Router();

/**
 * POST create user
 */
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

/**
 * POST login user
 * @param username
 * @param password
 */
router.post('/user/login', passport.authenticate('local', { session: false }), async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (error) {
    res.status(400).send({ message: 'Error logging in', error });
  }
});

/**
 * GET user profile
 * @param jwt
 */
router.get('/user/profile', passport.authenticate('jwt', { session: false }), async (req, res) => {
  res.send(req.user);
});

module.exports = router;