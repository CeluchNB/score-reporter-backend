const express = require('express');
const passport = require('passport');
const User = require('../models/user');
const Team = require('../models/team');

const router = express.Router();

/**
 * POST create team
 * @param jwt
 */
router.post('/team', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const team = new Team({
      ...req.body,
      owner: user._id,
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

/**
 * GET team
 * @param id
 */
router.get('/team/:id', async (req, res) => {
  try {
    const team = await Team.findOne({ _id: req.params.id });

    if (!team) {
      return res.status(404).send({ message: 'Team not found' });
    }

    return res.send(team);
  } catch (error) {
    return res.status(500).send({ message: 'Error finding team', error });
  }
});

/**
 * PATCH add follower to team
 * @param id
 * @param jwt
 */
router.patch('/team/:id/follow', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const { role } = req.body;

  try {
    const user = await User.findById(req.user._id);
    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(400).send({ message: 'Team not found' });
    }

    for (let i = 0; i < user.teams.length; i += 1) {
      if (user.teams[i].team.equals(team._id)) {
        return res.status(400).send({ message: 'Cannot follow a team twice' });
      }
    }

    team.followers.push({ user: user._id, role });
    user.teams.push({ team: team._id, role });

    await team.save();
    await user.save();
    return res.send(team);
  } catch (error) {
    return res.status(500).send({ message: 'Error following team' });
  }
});

module.exports = router;
