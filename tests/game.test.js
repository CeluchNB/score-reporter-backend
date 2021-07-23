/* eslint-disable no-undef */
const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../src/app');
const Game = require('../src/models/game');
const {
  userOne,
  userTwo,
  teamOneId,
  teamTwoId,
  seasonOneId,
  gameOneId,
  gameOne,
  unusedId,
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
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
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

    const responseGame = response.body;
    expect(responseGame.season.toString()).toBe(seasonOneId.toString());
    expect(responseGame.awayTeam.toString()).toBe(teamOneId.toString());
    expect(responseGame.homeTeam.toString()).toBe(teamTwoId.toString());
    expect(responseGame.innings.away[0]).toBe(0);
    expect(responseGame.innings.home[0]).toBe(0);

    const dbGame = await Game.findById(responseGame._id);
    expect(dbGame.season.toString()).toBe(seasonOneId.toString());
    expect(dbGame.awayTeam.toString()).toBe(teamOneId.toString());
    expect(dbGame.homeTeam.toString()).toBe(teamTwoId.toString());
  });

  test('including winner', async () => {
    const response = await request(app)
      .post('/game')
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send({
        season: seasonOneId,
        awayTeam: teamOneId,
        homeTeam: teamTwoId,
        innings: {
          away: [0, 1, 0, 0],
          home: [0, 0, 0, 0],
        },
        winner: teamOneId,
      })
      .expect(201);

    const game = response.body;
    expect(game.season.toString()).toBe(seasonOneId.toString());
    expect(game.awayTeam.toString()).toBe(teamOneId.toString());
    expect(game.homeTeam.toString()).toBe(teamTwoId.toString());
    expect(game.winner.toString()).toBe(teamOneId.toString());

    const dbGame = await Game.findById(game._id);
    expect(dbGame.season.toString()).toBe(seasonOneId.toString());
    expect(dbGame.awayTeam.toString()).toBe(teamOneId.toString());
    expect(dbGame.homeTeam.toString()).toBe(teamTwoId.toString());
    expect(dbGame.winner.toString()).toBe(teamOneId.toString());
  });

  test('without winner or innings', async () => {
    const response = await request(app)
      .post('/game')
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send({
        season: seasonOneId,
        awayTeam: teamOneId,
        homeTeam: teamTwoId,
      })
      .expect(201);

    const game = response.body;
    expect(game.season.toString()).toBe(seasonOneId.toString());
    expect(game.awayTeam.toString()).toBe(teamOneId.toString());
    expect(game.homeTeam.toString()).toBe(teamTwoId.toString());

    const dbGame = await Game.findById(game._id);
    expect(dbGame.season.toString()).toBe(seasonOneId.toString());
    expect(dbGame.awayTeam.toString()).toBe(teamOneId.toString());
    expect(dbGame.homeTeam.toString()).toBe(teamTwoId.toString());
  });

  test('with invalid user token', async () => {
    await request(app)
      .post('/game')
      .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
      .send({
        season: seasonOneId,
        awayTeam: teamOneId,
        homeTeam: teamTwoId,
        innings: {
          away: [0],
          home: [0],
        },
      })
      .expect(401);
  });

  test('with no user token', async () => {
    await request(app)
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
      .expect(401);
  });

  test('with no season', async () => {
    const response = await request(app)
      .post('/game')
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send({
        awayTeam: teamOneId,
        homeTeam: teamTwoId,
        innings: {
          away: [0],
          home: [0],
        },
      })
      .expect(400);

    expect(response.body.message).toBe('Season was invalid');
  });

  test('missing away team', async () => {
    const response = await request(app)
      .post('/game')
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send({
        season: seasonOneId,
        homeTeam: teamTwoId,
        innings: {
          away: [0],
          home: [0],
        },
      })
      .expect(400);

    expect(response.body.message).toBe('You must have both teams when creating a game.');
  });

  test('missing home team', async () => {
    const response = await request(app)
      .post('/game')
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send({
        season: seasonOneId,
        awayTeam: teamTwoId,
        innings: {
          away: [0],
          home: [0],
        },
      })
      .expect(400);

    expect(response.body.message).toBe('You must have both teams when creating a game.');
  });

  test('missing away team', async () => {
    const response = await request(app)
      .post('/game')
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send({
        season: seasonOneId,
        homeTeam: teamTwoId,
        innings: {
          away: [0],
          home: [0],
        },
      })
      .expect(400);

    expect(response.body.message).toBe('You must have both teams when creating a game.');
  });
});

describe('/PUT update game', () => {
  test('with updated score and winner', async () => {
    const game = JSON.parse(JSON.stringify(gameOne));
    game.innings.away = [0, 0, 0, 0, 0];
    game.innings.home = [0, 0, 0, 0, 1];
    game.winner = teamTwoId;

    const response = await request(app)
      .put('/game')
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send(game)
      .expect(200);

    const responseGame = response.body;
    expect(responseGame.awayTeam.toString()).toBe(teamOneId.toString());
    expect(responseGame.homeTeam.toString()).toBe(teamTwoId.toString());
    expect(responseGame.winner.toString()).toBe(teamTwoId.toString());

    const dbGame = await Game.findById(responseGame._id);
    expect(dbGame.awayTeam.toString()).toBe(teamOneId.toString());
    expect(dbGame.homeTeam.toString()).toBe(teamTwoId.toString());
    expect(dbGame.winner.toString()).toBe(teamTwoId.toString());
  });
});

describe('/GET game by id', () => {
  test('with valid id', async () => {
    const response = await request(app)
      .get(`/game/${gameOneId}`)
      .send()
      .expect(200);

    const responseGame = response.body;
    expect(responseGame.awayTeam.toString()).toBe(teamOneId.toString());
    expect(responseGame.homeTeam.toString()).toBe(teamTwoId.toString());
    expect(responseGame.innings.away[0]).toBe(0);
    expect(responseGame.innings.home[0]).toBe(1);
  });

  test('with unused id', async () => {
    const response = await request(app)
      .get(`/game/${unusedId}`)
      .send()
      .expect(404);

    expect(response.body.message).toBe('The game you requested does not exist');
  });

  test('with invalid id', async () => {
    const response = await request(app)
      .get('/game/asdf1234')
      .send()
      .expect(400);

    expect(response.body.message).toBe('We were unable to find the game you requested');
  });
});

describe('/DELETE game by id', () => {
  test('with valid game', async () => {
    const response = await request(app)
      .delete(`/game/${gameOneId}`)
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send()
      .expect(200);

    const responseGame = response.body;
    expect(responseGame.season.toString()).toBe(seasonOneId.toString());
    expect(responseGame.awayTeam.toString()).toBe(teamOneId.toString());
    expect(responseGame.homeTeam.toString()).toBe(teamTwoId.toString());
  });

  test('with invalid game', async () => {
    const response = await request(app)
      .delete(`/game/${unusedId}`)
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send()
      .expect(404);

    expect(response.body.message).toBe('The game you requested does not exist');
  });

  test('with unowned game', async () => {
    const response = await request(app)
      .delete(`/game/${gameOneId}`)
      .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
      .send()
      .expect(401);

    expect(response.body.message).toBe('You must own the game to delete it');
  });
});
