const express = require('express');
const passport = require('passport');
const Game = require('../models/game');
const Season = require('../models/season');

const router = express.Router();

/**
 * /POST game
 * @param jwt
 */
router.post('/game', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const season = await Season.findById(req.body.season);
    if (!season) {
      return res.status(400).send({ message: 'Season was invalid' });
    }

    if (!season.owner.equals(req.user._id)) {
      return res.status(401).send({ message: 'You must own the season to create a game' });
    }

    const game = new Game(req.body);

    await game.save();

    return res.status(201).send(game);
  } catch (error) {
    if (error.errors.awayTeam || error.errors.homeTeam) {
      return res.status(400).send({ message: 'You must have both teams when creating a game.' });
    }
    return res.status(400).send({ message: 'Error creating game' });
  }
});

module.exports = router;
