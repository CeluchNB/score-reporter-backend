const mongoose = require('mongoose');

const gameSchema = mongoose.Schema({
  season: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Season',
  },
  awayTeam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true,
  },
  homeTeam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true,
  },
  innings: {
    away: [{
      type: Number,
      required: true,
    }],
    home: [{
      type: Number,
      required: true,
    }],
  },
  winner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: false,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

const Game = mongoose.model('Game', gameSchema);

module.exports = Game;
