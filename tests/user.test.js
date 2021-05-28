const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user');
const {
  userOneId,
  userOne,
  userTwoId,
  userTwo,
  setupDatabase
} = require('./fixtures/test-db');

beforeEach(setupDatabase);

describe('/POST create user', () => {
  test('with valid data', async () => {
    const response = await request(app)
      .post('/user')
      .send({
        firstName: 'Evan',
        lastName: 'Celuch',
        email: 'evan@cnc.com',
        password: 'MyPass#5'
      })
      .expect(201);

    const user = await User.findById(response.body.user._id);
    expect(user).not.toBeNull();

    expect(response.body.user).toMatchObject({
      firstName: 'Evan',
      lastName: 'Celuch',
      email: 'evan@cnc.com'
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
        password: 'GoodP@ss98'
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
        password: 'Shrtps'
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
        password: 'LongAlphaNum3ericP0ss'
      })
      .expect(400);

    expect(response.body.message).toBe('Error creating user');
  });
});

describe('/POST user login', () => {
  test('with valid email/pass', async () => {
    const response = await request(app)
      .post('/user/login')
      .send({
        email: userOne.email,
        password: userOne.password
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
        password: userOne.password
      })
      .expect(500);

    expect(response.body).toMatchObject({});
  });

  test('with invalid password', async () => {
    const response = await request(app)
      .post('/user/login')
      .send({
        email: userOne.email,
        password: 'badpass'
      })
      .expect(500);

    expect(response.body).toMatchObject({});
  });
});


// TODO test get user profile call