const mongoose = require('mongoose');
const User = require('../../src/models/user');

const userOneId = new mongoose.Types.ObjectId();
const userOne = {
  _id: userOneId,
  firstName: 'Peyton',
  lastName: 'Celuch',
  email: 'peyton@test.com',
  password: 'FakeP@ss1'
};

const userTwoId = new mongoose.Types.ObjectId();
const userTwo = {
  _id: userTwoId,
  firstName: 'Amy',
  lastName: 'Celuch',
  email: 'amy@pitt.com',
  password: 'GoodPass2!'
};

const setupDatabase = async () => {
  await User.deleteMany();

  await new User(userOne).save();
  await new User(userTwo).save();
}

module.exports = {
  userOneId,
  userOne,
  userTwoId,
  userTwo,
  setupDatabase
};