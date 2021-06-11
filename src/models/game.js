const mongoose = require('mongoose');

const gameSchema = mongoose.Schema({
  season: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Season',
  },
  homeTeam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true,
  },
  awayTeam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
  },
  innings: [{
    away: {
      type: Number,
      required: true,
    },
    home: {
      type: Number,
      required: true,
    },
  }],
  winner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
  },
});

const Game = mongoose.model('Game', gameSchema);

module.exports = Game;
