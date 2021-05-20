const mongoose = require('mongoose');

const teamSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  founded: {
    type: Date,
    required: true,
    default: Date.now
  },
  ended: {
    type: Date,
    required: false
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  followers: [{
    user: {
      type: mongoose.Schema.Types.ObjectId
    },
    role: {
      type: String,
      enum: ['Fan', 'Coach', 'Player'],
      required: true,
      default: 'Fan'
    }
  }]
}, {
  timestamps: true
});

const Team = mongoose.model('Team', teamSchema);

module.exports = Team;