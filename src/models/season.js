const mongoose = require('mongoose');

const seasonSchema = mongoose.Schema({
  startDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  endDate: {
    type: Date,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  games: [{
    game: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Game'
    }
  }]
}, {
  timestamps: true,
});

const Season = mongoose.model('Season', seasonSchema);

module.exports = Season;
