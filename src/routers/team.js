const express = require('express');
const passport = require('passport');
const User = require('./../models/user');
const Team = require('./../models/team');

const router = express.Router();

router.post('/team', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const team = new Team({
      ...req.body,
      owner: user._id
    });

    // Set approriate role
    team.followers.push({ user: user._id, role: req.body.role });
    user.teams.push({ team: team._id, role: req.body.role });

    await team.save();
    await user.save();
    res.send(team);
  } catch (error) {
    res.status(400).send({ message: 'Error creating team', error });
  }
});

module.exports = router;