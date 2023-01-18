const request = require('supertest');
const app = require('../../src/app');

let user;

beforeAll(async () => {
  const receivid = await app.services.users.create({
    name: 'user account',
    mail: `${Date.now()}test@mail.com`,
    password: '12345',
  });
  user = { ...receivid[0] };
});

test('Deve inserir uma conta com sucesso', async () => {
  const receivid = await request(app)
    .post('/accounts')
    .send({ name: 'Acc #1', user_id: user.id });

  expect(receivid.status).toBe(201);
  expect(receivid.body.name).toBe('Acc #1');
});

test('Deve listar todas as contas', async () => {
  await app.db('accounts').insert({ name: 'Acc test', user_id: user.id });
  const receivid = await request(app).get('/accounts');
  expect(receivid.status).toBe(200);
  expect(receivid.body.length).toBeGreaterThan(0);
});
