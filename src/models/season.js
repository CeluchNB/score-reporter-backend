const mongoose = require('mongoose');

const seasonSchema = mongoose.Schema({
  startYear: {
    type: Date,
    required: true,
    default: Date.now
  },
  endYear: {
    type: Date,
    required: true
  },
  games: [{
    game: mongoose.Schema.Types.ObjectId
  }]
}, {
  timestamps: true
});

const Season = mongoose.model('Season', seasonSchema);

module.exports = Season;