/* eslint-disable no-undef */
const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../src/app');
const Game = require('../src/models/game');
const {
  teamOneId,
  teamTwoId,
  seasonOneId,
  setupDatabase,
} = require('./fixtures/test-db');

afterAll((done) => {
  mongoose.connection.close();
  done();
});

beforeEach(setupDatabase);

describe('/POST create game', () => {
  test('with valid data', async () => {
    const response = await request(app)
      .post('/game')
      .send({
        season: seasonOneId,
        awayTeam: teamOneId,
        homeTeam: teamTwoId,
        innings: {
          away: [0],
          home: [0],
        },
      })
      .expect(201);

    const game = response.body;
    expect(game.season).toBe(seasonOneId);
    expect(game.awayTeam).toBe(teamOneId);
    expect(game.homeTeam).toBe(teamTwoId);

    const dbGame = Game.findById(game._id);
    expect(dbGame.season).toBe(seasonOneId);
    expect(dbGame.awayTeam).toBe(teamOneId);
    expect(dbGame.homeTeam).toBe(teamTwoId);
  });
});
