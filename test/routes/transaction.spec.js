const request = require('supertest');
const jwt = require('jwt-simple');
const app = require('../../src/app');

let user;
let user2;
let accUser;
let accUser2;

beforeAll(async () => {
  await app.db('transactions').del();
  await app.db('accounts').del();
  await app.db('users').del();
  const users = await app.db('users').insert(
    [
      {
        name: 'User #1',
        mail: 'user@mail.com',
        password:
          '$2a$10$uCIFQjASyROIYFmw/D7FKOkKjfv.NGHluwvh76osHXhmHZ5qNTupa',
      },
      {
        name: 'User #2',
        mail: 'user2@mail.com',
        password:
          '$2a$10$uCIFQjASyROIYFmw/D7FKOkKjfv.NGHluwvh76osHXhmHZ5qNTupa',
      },
    ],
    '*'
  );
  [user, user2] = users;
  delete user.password;
  user.token = jwt.encode(user, 'Segredo!');

  const accs = await app.db('accounts').insert(
    [
      { name: 'Acc #1', user_id: user.id },
      { name: 'Acc #2', user_id: user2.id },
    ],
    '*'
  );
  [accUser, accUser2] = accs;
});

test('Deve listar apenas as transações do usuário', async () => {
  await app.db('transactions').insert([
    {
      description: 'T1',
      date: new Date(),
      ammount: 100,
      type: 'I',
      acc_id: accUser.id,
    },
    {
      description: 'T2',
      date: new Date(),
      ammount: 300,
      type: 'O',
      acc_id: accUser2.id,
    },
  ]);

  const received = await request(app)
    .get('/api/transactions')
    .set('authorization', `bearer ${user.token}`);

  console.log(received.body[0]);

  expect(received.status).toBe(200);
  expect(received.body).toHaveLength(1);
  expect(received.body[0].description).toBe('T1');
});
