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
}, {
  timestamps: true,
});

const Season = mongoose.model('Season', seasonSchema);

module.exports = Season;
