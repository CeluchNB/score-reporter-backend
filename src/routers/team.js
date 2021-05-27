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
    res.status(201).send(team);
  } catch (error) {
    res.status(400).send({ message: 'Error creating team', error });
  }
});

router.get('/team/:id', async (req, res) => {
  try {
    const team = await Team.findOne({ _id: req.params.id });

    if (!team) {
      return res.status(404).send({ message: 'Team not found' });
    }

    res.send(team);
  } catch (error) {
    res.status(500).send({ message: 'Error finding team', error });
  }
});

router.patch('/team/:id/follow', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const { role } = req.body;

  try {
    const user = await User.findById(req.user._id);
    const team = await Team.findById(req.params.id);

    if (!team) {
      res.status(400).send({ message: 'Team not found' });
    }

    for (let i = 0; i < user.teams.length; i++) {
      if (user.teams[i].team.equals(team._id)) {
        res.status(400).send({ message: 'Cannot follow a team twice' });
        return;
      }
    }

    team.followers.push({ user: user._id, role });
    user.teams.push({ team: team._id, role });

    await team.save();
    await user.save();
    res.send(team);
  } catch (error) {
    res.status(400).send({ message: 'Error following team' });
  }
});

module.exports = router;