const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../../src/models/user');
const Team = require('../../src/models/team');
const Season = require('../../src/models/season');

const userOneId = new mongoose.Types.ObjectId();
const userOne = {
  _id: userOneId,
  firstName: 'Peyton',
  lastName: 'Celuch',
  email: 'peyton@test.com',
  password: 'FakeP@ss1',
  tokens: [{
    token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
  }]
};

const userTwoId = new mongoose.Types.ObjectId();
const userTwo = {
  _id: userTwoId,
  firstName: 'Amy',
  lastName: 'Celuch',
  email: 'amy@pitt.com',
  password: 'GoodPass2!',
  tokens: [{
    token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET)
  }]
};

const teamOneId = new mongoose.Types.ObjectId();
const teamOne = {
  _id: teamOneId,
  name: "Peyton's Team",
  founded: "2015",
  role: "Coach",
  owner: userOneId,
  followers: [{
    user: userOneId, role: 'Coach'
  }]
};

const teamTwoId = new mongoose.Types.ObjectId();
const teamTwo = {
  _id: teamTwoId,
  name: "Evan's Team",
  founded: "2018",
  role: "Player",
  owner: userTwoId
};

const setupDatabase = async () => {
  await User.deleteMany();
  await Team.deleteMany();

  await new User(userOne).save();
  await new User(userTwo).save();

  //await new Team(teamOne).save();
  await new Team(teamTwo).save();
  await new Team(teamOne).save();
}

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
  unusedId,
  startDate,
  endDate,
  setupDatabase
};