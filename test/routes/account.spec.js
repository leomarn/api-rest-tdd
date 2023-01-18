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

test('Deve retornar uma conta por id', async () => {
  const account = await app
    .db('accounts')
    .insert({ name: 'Acc By id', user_id: user.id }, ['id']);
  const receivid = await request(app).get(`/accounts/${account[0].id}`);
  expect(receivid.status).toBe(200);
  expect(receivid.body.name).toBe('Acc By id');
  expect(receivid.body.user_id).toBe(user.id);
});

test('Deve alterar uma conta', async () => {
  const account = await app
    .db('accounts')
    .insert({ name: 'Acc to update', user_id: user.id }, ['id']);
  const receivid = await request(app)
    .put(`/accounts/${account[0].id}`)
    .send({ name: 'Acc updated' });
  expect(receivid.status).toBe(200);
  expect(receivid.body.name).toBe('Acc updated');
});
