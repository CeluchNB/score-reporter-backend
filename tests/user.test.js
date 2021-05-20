const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user');
const {
  userOneId,
  userOne,
  userTwoId,
  userTwo,
  setupDatabase
} = require('./fixtures/db');

beforeEach(setupDatabase);

test('user with valid data should be appropriately saved', async () => {
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

test('user with invalid email should not be saved', async () => {
  const response = await request(app)
    .post('/user')
    .send({
      firstName: 'Evan',
      lastName: 'Celuch',
      email: 'lolbademail',
      password: 'GoodP@ss98'
    })
    .expect(400);

  expect(response.body.errors.email.message).toBe('Invalid email field');
});

test('user with short password should not be saved', async () => {
  const response = await request(app)
    .post('/user')
    .send({
      firstName: 'Evan',
      lastName: 'Celuch',
      email: 'evan@cnc.com',
      password: 'Shrtps'
    })
    .expect(400);

  expect(response.body.errors.password.kind).toBe('minlength');
});

test('user without special character should not be saved', async () => {
  const response = await request(app)
    .post('/user')
    .send({
      firstName: 'Evan',
      lastName: 'Celuch',
      email: 'evan@cnc.com',
      password: 'LongAlphaNum3ericP0ss'
    })
    .expect(400);

  expect(response.body.errors.password.message).toBe('Password must contain a special character');
});

test('user should be logged in with valid email/pass', async () => {
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

test('user should not be logged in with invalid email', async () => {
  const response = await request(app)
    .post('/user/login')
    .send({
      email: 'nonexistent@email.com',
      password: userOne.password
    })
    .expect(400);

  expect(response.body).toMatchObject({});
});

test('user should not be logged in with invalid password', async () => {
  const response = await request(app)
    .post('/user/login')
    .send({
      email: userOne.email,
      password: 'hahabadpassidiot'
    })
    .expect(400);

  expect(response.body).toMatchObject({});
});

// TODO test get user profile call