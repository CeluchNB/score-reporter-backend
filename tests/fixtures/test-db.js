const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../../src/models/user');
const Team = require('../../src/models/team');
const Season = require('../../src/models/season');
const Game = require('../../src/models/game');

const userOneId = new mongoose.Types.ObjectId();
const userTwoId = new mongoose.Types.ObjectId();

const teamOneId = new mongoose.Types.ObjectId();
const teamTwoId = new mongoose.Types.ObjectId();

const userOne = {
  _id: userOneId,
  firstName: 'Peyton',
  lastName: 'Celuch',
  email: 'peyton@test.com',
  password: 'FakeP@ss1',
  tokens: [{
    token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET),
  }],
  teams: [{
    team: teamOneId,
    role: 'Coach',
  }],
};

const userTwo = {
  _id: userTwoId,
  firstName: 'Amy',
  lastName: 'Celuch',
  email: 'amy@pitt.com',
  password: 'GoodPass2!',
  tokens: [{
    token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET),
  }],
  teams: [{
    team: teamTwoId,
    role: 'Player',
  }],
};

const teamOne = {
  _id: teamOneId,
  name: 'Peyton\'s Team',
  founded: '2015',
  role: 'Coach',
  owner: userOneId,
  followers: [{
    user: userOneId, role: 'Coach',
  }],
  seasons: [],
};

const teamTwo = {
  _id: teamTwoId,
  name: 'Evan\'s Team',
  founded: '2018',
  role: 'Player',
  owner: userTwoId,
  followers: [{
    user: userTwoId, role: 'Player',
  }],
  seasons: [],
};

const seasonOneId = new mongoose.Types.ObjectId();
const seasonOne = {
  _id: seasonOneId,
  startDate: new Date().setFullYear(2012),
  endDate: new Date().setFullYear(2013),
  owner: userOneId,
};

const gameOneId = new mongoose.Types.ObjectId();
const gameOne = {
  _id: gameOneId,
  season: seasonOneId,
  awayTeam: teamOneId,
  homeTeam: teamTwoId,
  innings: {
    away: [0, 0, 0, 0, 0, 0, 2],
    home: [1, 0, 0, 0, 0, 0, 0],
  },
  winner: teamOneId,
};

const setupDatabase = async () => {
  await User.deleteMany();
  await Team.deleteMany();
  await Season.deleteMany();
  await Game.deleteMany();

  await new User(userOne).save();
  await new User(userTwo).save();

  await new Team(teamOne).save();
  await new Team(teamTwo).save();

  await new Season(seasonOne).save();

  await new Game(gameOne).save();
};

const unusedId = new mongoose.Types.ObjectId();

const startDate = new Date().setFullYear(2015);
const endDate = new Date().setFullYear(2016);

module.exports = {
  userOneId,
  userOne,
  userTwoId,
  userTwo,
  teamOneId,
  teamOne,
  teamTwoId,
  teamTwo,
  seasonOneId,
  seasonOne,
  gameOneId,
  gameOne,
  unusedId,
  startDate,
  endDate,
  setupDatabase,
};
