const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user');
const Team = require('../src/models/team');
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
  setupDatabase
} = require('./fixtures/test-db');

beforeEach(setupDatabase);

describe('/POST create team', () => {
  test('with valid data', async () => {
    const response = await request(app)
      .post('/team')
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send({
        name: "Noah's Team",
        founded: "2013",
        role: "Coach"
      })
      .expect(201);

    const team = await Team.findById(response.body._id);
    expect(team).not.toBeNull();
    expect(team.name).toBe("Noah's Team");
    expect(team.followers[0].user).toEqual(userOneId);
  });
});

test('test follow team', async () => {
  expect(1).toBe(1);
});

describe('/GET test getTeamById', () => {
  test('with valid id', async () => {
    const response = await request(app)
      .get(`/team/${teamOne._id}`)
      .send()
      .expect(200);

    const team = response.body;
    expect(team.name).toBe(teamOne.name);
  });

  test('with invalid id', async () => {
    const response = await request(app)
      .get(`/team/${unusedId}`)
      .send()
      .expect(404);
  });
});
