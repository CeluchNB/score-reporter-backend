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
    season.games.push({ game: game._id })

    await game.save();
    await season.save();
    
    return res.status(201).send(game);
  } catch (error) {
    let message = 'Error creating game';
    if (error.errors.awayTeam || error.errors.homeTeam) {
      message = 'You must have both teams when creating a game.';
    }
    return res.status(400).send({ message });
  }
});

router.get('/game/:id', async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) {
      return res.status(404).send({ message: 'The game you requested does not exist' });
    }

    return res.send(game);
  } catch (error) {
    return res.status(400).send({ message: 'We were unable to find the game you requested' });
  }
});

router.put('/game', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const season = await Season.findById(req.body.season);
    if (!season) {
      return res.status(404).send({ message: 'Season was not found' });
    }

    if (!season.owner.equals(req.user._id)) {
      return res.status(401).send({ message: 'You must own the season to update a game' });
    }

    const game = new Game(req.body);
    await Game.replaceOne({ _id: game._id }, game);

    return res.send(game);
  } catch (error) {
    return res.status(400).send({ message: 'Error replacing game' });
  }
});

router.delete('/game/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) {
      return res.status(404).send({ message: 'The game you requested does not exist' });
    }

    const season = await Season.findById(game.season);
    if (!season.owner.equals(req.user._id)) {
      return res.status(401).send({ message: 'You must own the game to delete it' });
    }

    await Game.deleteOne({ _id: game._id });
    return res.send(game);
  } catch (error) {
    return res.status(400).send({ message: 'Unable to delete game' });
  }
});

module.exports = router;
