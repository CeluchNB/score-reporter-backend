/* eslint-disable no-undef */
const mongoose = require('mongoose');
const request = require('supertest');
const { response } = require('../src/app');
const app = require('../src/app');
const User = require('../src/models/user');
const {
  userOneId,
  userOne,
  setupDatabase,
} = require('./fixtures/test-db');

afterAll((done) => {
  mongoose.connection.close();
  done();
});

beforeEach(setupDatabase);

describe('/POST create user', () => {
  test('with valid data', async () => {
    const response = await request(app)
      .post('/user')
      .send({
        firstName: 'Evan',
        lastName: 'Celuch',
        email: 'evan@cnc.com',
        password: 'MyPass#5',
      })
      .expect(201);

    const user = await User.findById(response.body.user._id);
    expect(user).not.toBeNull();

    expect(response.body.user).toMatchObject({
      firstName: 'Evan',
      lastName: 'Celuch',
      email: 'evan@cnc.com',
    });

    expect(user.password).not.toBe('MyPass#5');
  });

  test('with invalid email', async () => {
    const response = await request(app)
      .post('/user')
      .send({
        firstName: 'Evan',
        lastName: 'Celuch',
        email: 'lolbademail',
        password: 'GoodP@ss98',
      })
      .expect(400);

    expect(response.body.message).toBe('Error creating user');
  });

  test('with short password', async () => {
    const response = await request(app)
      .post('/user')
      .send({
        firstName: 'Evan',
        lastName: 'Celuch',
        email: 'evan@cnc.com',
        password: 'Shrtps',
      })
      .expect(400);

    expect(response.body.message).toBe('Error creating user');
  });

  test('password without special character', async () => {
    const response = await request(app)
      .post('/user')
      .send({
        firstName: 'Evan',
        lastName: 'Celuch',
        email: 'evan@cnc.com',
        password: 'LongAlphaNum3ericP0ss',
      })
      .expect(400);

    expect(response.body.message).toBe('Error creating user');
  });
});

// TODO invalid login requests should yield 401's
describe('/POST user login', () => {
  test('with valid email/pass', async () => {
    const response = await request(app)
      .post('/user/login')
      .send({
        email: userOne.email,
        password: userOne.password,
      })
      .expect(200);

    expect(response.body.user._id).toEqual(userOneId.toString());
    expect(response.body.token).not.toBeNull();
  });

  test('with invalid email', async () => {
    const response = await request(app)
      .post('/user/login')
      .send({
        email: 'nonexistent@email.com',
        password: userOne.password,
      })
      .expect(500);

    expect(response.body).toMatchObject({});
  });

  test('with invalid password', async () => {
    const response = await request(app)
      .post('/user/login')
      .send({
        email: userOne.email,
        password: 'badpass',
      })
      .expect(500);

    expect(response.body).toMatchObject({});
  });

  test('while causing error', async () => {
    jest.spyOn(User.prototype, 'generateAuthToken')
      .mockImplementationOnce(() => {
        throw Error('Error');
      });
    const response = await request(app)
      .post('/user/login')
      .send({
        email: userOne.email,
        password: userOne.password,
      })
      .expect(500);
    expect(response.body.message).toBe('Error logging in');
  });
});

// TODO test get user profile call
describe('/GET user profile', () => {
  test('with authentication', async () => {
    const response = await request(app)
      .get('/user/profile')
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send()
      .expect(200);

    expect(response.body._id).toEqual(userOne._id.toString());
    expect(response.body.email).toEqual(userOne.email);
    expect(response.body.password).not.toBe(userOne.password);
  });

  test('without authentication', async () => {
    await request(app)
      .get('/user/profile')
      .send()
      .expect(401);
  });

  test('with bad authentication', async () => {
    await request(app)
      .get('/user/profile')
      .set('Authorization', 'Bearer asfdasdf.hfsags.asdfas')
      .send()
      .expect(401);
  });
});

describe('/POST logout one token', () => {
  test('logout with valid token', async () => {
    const { token } = userOne.tokens[0];
    await request(app)
      .post('/user/logout')
      .set('Authorization', `Bearer ${token}`)
      .send()
      .expect(200);

    const user = User.findById(userOne._id);
    expect(user.tokens).toEqual(expect.not.arrayContaining([token]));
  });

  test('logout without valid token', async () => {
    await request(app)
      .post('/user/logout')
      .set('Authorization', 'Bearer 1234.asdf.1234')
      .send()
      .expect(401);
  });

  test('logout while causing error', async () => {
    jest.spyOn(User.prototype, 'save')
      .mockImplementationOnce(() => {
        throw Error('Error');
      });

    const { token } = userOne.tokens[0];
    const response = await request(app)
      .post('/user/logout')
      .set('Authorization', `Bearer ${token}`)
      .send()
      .expect(500);

    expect(response.body.message).toBe('Error signing out');
  });
});

describe('/POST logout all devices', () => {
  test('logout all with valid token', async () => {
    const { token } = userOne.tokens[0];
    await request(app)
      .post('/user/logoutAll')
      .set('Authorization', `Bearer ${token}`)
      .send()
      .expect(200);

    const user = await User.findById(userOne._id);
    expect(user.tokens.length).toEqual(0);
  });

  test('logout all with invalid token', async () => {
    await request(app)
      .post('/user/logoutAll')
      .set('Authorization', 'Bearer 9876.asdf.htu34f')
      .send()
      .expect(401);
  });

  test('logout all while causing an error', async () => {
    jest.spyOn(User.prototype, 'save')
      .mockImplementationOnce(() => {
        throw Error('Error');
      });
    const { token } = userOne.tokens[0];
    const response = await request(app)
      .post('/user/logoutAll')
      .set('Authorization', `Bearer ${token}`)
      .send()
      .expect(500);

    expect(response.body.message).toBe('Error signing out');
  });
});

describe('/GET user by id', () => {
  test('get user with valid id', async () => {
    const response = await request(app)
      .get(`/user/${userOneId}`)
      .send()
      .expect(200)
    
    const user = response.body;
    expect(user.firstName).toBe(userOne.firstName);
    expect(user.lastName).toBe(userOne.lastName);
    expect(user.email).toBe(userOne.email);
    expect(user.teams.length).toBe(userOne.teams.length);
    expect(user.password).toBe(undefined);
    expect(user.tokens).toBe(undefined);
  });

  test('get user with invalid id', async () => {
    const response = await request(app)
      .get(`/user/badid`)
      .send()
      .expect(404);

      expect(response.body.message).toBe('Unable to find user');
  });
});