/* eslint-disable no-undef */
const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user');
const Team = require('../src/models/team');
const {
  userOneId,
  userOne,
  teamOne,
  teamTwoId,
  teamTwo,
  unusedId,
  setupDatabase,
} = require('./fixtures/test-db');

afterAll((done) => {
  mongoose.connection.close();
  done();
});

beforeEach(setupDatabase);

describe('/POST create team', () => {
  test('with valid data', async () => {
    const response = await request(app)
      .post('/team')
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send({
        name: "Noah's Team",
        founded: '2013',
        role: 'Coach',
      })
      .expect(201);

    const team = await Team.findById(response.body._id);
    expect(team).not.toBeNull();
    expect(team.name).toBe("Noah's Team");
    expect(team.followers[0].user).toEqual(userOneId);
  });

  test('with invalid data', async () => {
    const response = await request(app)
      .post('/team')
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send({
        badname: "Noah's Team",
        badfounded: '2013',
        role: 'Coach',
      })
      .expect(400);

    expect(response.body.message).toBe('Error creating team');
  });
});

describe('/GET team by id', () => {
  test('with valid id', async () => {
    const response = await request(app)
      .get(`/team/${teamOne._id}`)
      .send()
      .expect(200);

    const team = response.body;
    expect(team.name).toBe(teamOne.name);
  });

  test('with unused id', async () => {
    const response = await request(app)
      .get(`/team/${unusedId}`)
      .send()
      .expect(404);

    expect(response.body.message).toBe('Team not found');
  });

  test('with invalid id', async () => {
    const response = await request(app)
      .get('/team/asdfasdf')
      .send()
      .expect(500);

    expect(response.body.message).toBe('Error finding team');
  });
});

describe('/PATCH follow team', () => {
  test('with valid id and valid user', async () => {
    const response = await request(app)
      .patch(`/team/${teamTwo._id}/follow`)
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send({
        role: 'Coach',
      })
      .expect(200);

    const team = await Team.findById(teamTwo._id);
    const user = await User.findById(userOne._id);

    expect(response.body.name).toBe(teamTwo.name);
    expect(team.followers).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          user: userOneId,
          role: 'Coach',
        }),
      ]),
    );
    expect(user.teams).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          team: teamTwoId,
          role: 'Coach',
        }),
      ]),
    );
  });

  test('without authentication', async () => {
    await request(app)
      .patch(`/team/${teamTwo._id}/follow`)
      .send({
        role: 'Coach',
      })
      .expect(401);
  });

  test('with previously following user', async () => {
    const response = await request(app)
      .patch(`/team/${teamOne._id}/follow`)
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send({
        role: 'Coach',
      })
      .expect(400);

    expect(response.body.message).toEqual('Cannot follow a team twice');
  });

  test('with non-existent team', async () => {
    const response = await request(app)
      .patch(`/team/${new mongoose.Types.ObjectId()}/follow`)
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send({
        role: 'Coach',
      })
      .expect(400);

    expect(response.body.message).toEqual('Team not found');
  });

  test('with invalid id', async () => {
    const response = await request(app)
      .patch('/team/asdfasdf/follow')
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send({
        role: 'Coach',
      })
      .expect(500);

    expect(response.body.message).toEqual('Error following team');
  });
});
