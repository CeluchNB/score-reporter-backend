const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user');
const Team = require('../src/models/team');
const Season = require('../src/models/season');
const {
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
} = require('./fixtures/test-db');

beforeEach(setupDatabase);

describe('/POST create season', () => {
  test('add season to team 1', async () => {
    const response = await request(app)
      .post('/season')
      .send({
        startYear: startDate,
        endYear: endDate,
        teamId: teamOneId
      })
      .expect(201);

    const seasonId = req.body._id;
    const season = await season.findById(seasonId);
    const team = await Team.findById(teamOneId);

    expect(response.body.startYear).toEqual(startDate);
    expect(season.startYear).toEqual(startDate);
    expect(team.seasons.length).toBe(1);
    expect(team.seasons[0].season).toEqual(seasonId);
  });

  test('add season with invalid start date', async () => {
    const response = await request(app)
      .post('/season')
      .send({
        startYear: "2015",
        endYear: endDate,
        teamId: teamOneId
      })
      .expect(400);

    expect(response.body.message).toBe('Error creating season');
  });

  test('add season with invalid end date', async () => {
    const response = await request(app)
      .post('/season')
      .send({
        startYear: startDate,
        endYear: 2016,
        teamId: teamOneId
      })
      .expect(400);

    expect(response.body.message).toBe('Error creating season');
  });

  test('add season with invalid team', async () => {
    const response = await request(app)
      .post('/season')
      .send({
        startYear: startDate,
        endYear: 2016,
        teamId: "bad id"
      })
      .expect(400);

    expect(response.body.message).toBe('Error creating season');
  });

});