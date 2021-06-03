const express = require('express');
const passport = require('passport');
const Team = require('./../models/team');
const Season = require('./../models/season');

const router = express.Router();

/**
 * POST create season
 * @param jwt
 */
router.post('/season', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const team = await Team.findById(req.body.teamId);
    if (!req.body.teamId || !team.owner.equals(req.user._id)) {
      return res.status(401).send({ message: 'You must own the team to make changes to it' });
    }

    const season = new Season({
      ...req.body
    });
    team.seasons.push({ season: season._id });

    await season.save();
    await team.save();
    res.status(201).send(season);
  } catch (error) {
    res.status(400).send({ message: 'Error creating season' });
  }
});

/**
 * GET season
 * @param id
 */
router.get('/season/:id', async (req, res) => {
  try {
    const season = await Season.findOne({ _id: req.params.id });

    if (!season) {
      return res.status(404).send({ message: 'Season not found' });
    }

    res.send(season);
  } catch (error) {
    res.status(500).send({ message: 'Error trying to find season' });
  }
});

module.exports = router;