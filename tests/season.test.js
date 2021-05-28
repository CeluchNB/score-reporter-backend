const request = require('supertest');
const app = require('../src/app');
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
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send({
        startDate: startDate,
        endDate: endDate,
        teamId: teamOneId
      })
      .expect(201);

    const seasonId = response.body._id;
    const season = await Season.findById(seasonId);
    const team = await Team.findById(teamOneId);

    expect(new Date(response.body.startDate)).toEqual(new Date(startDate));
    expect(season.startDate).toEqual(new Date(startDate));
    expect(season.endDate).toEqual(new Date(endDate));
    expect(team.seasons.length).toBe(1);
    expect(team.seasons[0].season.toString()).toBe(seasonId);
  });

  test('add season with invalid start date', async () => {
    const response = await request(app)
      .post('/season')
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send({
        startDate: "horrible date",
        endDate: endDate,
        teamId: teamOneId
      })
      .expect(400);

    expect(response.body.message).toBe('Error creating season');
  });

  test('add season with invalid end date', async () => {
    const response = await request(app)
      .post('/season')
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send({
        startDate: startDate,
        endDate: "no good",
        teamId: teamOneId
      })
      .expect(400);

    expect(response.body.message).toBe('Error creating season');
  });

  test('add season with invalid team', async () => {
    const response = await request(app)
      .post('/season')
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send({
        startDate: startDate,
        endDate: endDate,
        teamId: "bad id"
      })
      .expect(400);
  });

  test('add season with invalid user token', async () => {
    await request(app)
      .post('/season')
      .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
      .send({
        startDate: "2015",
        endDate: endDate,
        teamId: teamOneId
      })
      .expect(401);
  });

  test('add season with no user token', async () => {
    await request(app)
      .post('/season')
      .send({
        startDate: "2015",
        endDate: endDate,
        teamId: teamOneId
      })
      .expect(401);
  });

});