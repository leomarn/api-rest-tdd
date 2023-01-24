const request = require('supertest');
const app = require('../../src/app');
const jwt = require('jwt-simple');

let user;
let user2;

beforeEach(async () => {
  const receivid = await app.services.users.create({
    name: 'user account',
    mail: `${Date.now()}test@mail.com`,
    password: '123456',
  });
  user = { ...receivid[0] };
  user.token = jwt.encode(user, 'Segredo!');

  const receivid2 = await app.services.users.create({
    name: 'user account 2',
    mail: `${Date.now()}test@mail.com`,
    password: '123456',
  });
  user2 = { ...receivid2[0] };
});

test('Deve inserir uma conta com sucesso', async () => {
  const receivid = await request(app)
    .post('/api/accounts')
    .send({ name: 'Acc #1' })
    .set('authorization', `bearer ${user.token}`);

  expect(receivid.status).toBe(201);
  expect(receivid.body.name).toBe('Acc #1');
});

test('Não deve inserir conta sem atributo nome', async () => {
  const receivid = await request(app)
    .post('/api/accounts')
    .send({})
    .set('authorization', `bearer ${user.token}`);

  expect(receivid.status).toBe(400);
  expect(receivid.body.error).toBe('Nome é um atributo obrigatório');
});

test('Não deve inserir conta de nome duplicado, para o mesmo usuário', async () => {
  await app.db('accounts').insert({ name: 'Acc duplicada', user_id: user.id });

  const receivid = await request(app)
    .post('/api/accounts')
    .set('authorization', `bearer ${user.token}`)
    .send({ name: 'Acc duplicada' });

  expect(receivid.status).toBe(400);
  expect(receivid.body.error).toBe('Já existe uma conta com esse nome');
});

test('Deve listar apenas as contas do usuário', async () => {
  await app.db('accounts').insert([
    { name: 'Acc user #1', user_id: user.id },
    { name: 'Acc user #2', user_id: user2.id },
  ]);

  const receivid = await request(app)
    .get('/api/accounts')
    .set('authorization', `bearer ${user.token}`);

  expect(receivid.status).toBe(200);
  expect(receivid.body.length).toBe(1);
  expect(receivid.body[0].name).toBe('Acc user #1');
});

test('Deve retornar uma conta por id', async () => {
  const account = await app
    .db('accounts')
    .insert({ name: 'Acc By id', user_id: user.id }, ['id']);

  const receivid = await request(app)
    .get(`/api/accounts/${account[0].id}`)
    .set('authorization', `bearer ${user.token}`);

  expect(receivid.status).toBe(200);
  expect(receivid.body.name).toBe('Acc By id');
  expect(receivid.body.user_id).toBe(user.id);
});

test('Não deve retornar uma conta de outro usuário', async () => {
  const account = await app
    .db('accounts')
    .insert({ name: 'Acc User #2', user_id: user2.id }, ['id']);

  const receivid = await request(app)
    .get(`/api/accounts/${account[0].id}`)
    .set('authorization', `bearer ${user.token}`);

  expect(receivid.status).toBe(403);
  expect(receivid.body.error).toBe('Este recurso não pertence ao usuário');
});

test('Deve alterar uma conta', async () => {
  const account = await app
    .db('accounts')
    .insert({ name: 'Acc to update', user_id: user.id }, ['id']);

  const receivid = await request(app)
    .put(`/api/accounts/${account[0].id}`)
    .send({ name: 'Acc updated' })
    .set('authorization', `bearer ${user.token}`);

  expect(receivid.status).toBe(200);
  expect(receivid.body.name).toBe('Acc updated');
});

test('Não deve alterar uma conta de outro usuário', async () => {
  const account = await app
    .db('accounts')
    .insert({ name: 'Acc User #2', user_id: user2.id }, ['id']);

  const receivid = await request(app)
    .put(`/api/accounts/${account[0].id}`)
    .send({ name: 'Acc Updated' })
    .set('authorization', `bearer ${user.token}`);

  expect(receivid.status).toBe(403);
  expect(receivid.body.error).toBe('Este recurso não pertence ao usuário');
});

test('Deve remover uma conta', async () => {
  const account = await app
    .db('accounts')
    .insert({ name: 'Acc to remove', user_id: user.id }, ['id']);

  const receivid = await request(app)
    .delete(`/api/accounts/${account[0].id}`)
    .set('authorization', `bearer ${user.token}`);

  expect(receivid.status).toBe(204);
});

test('Não deve remover uma conta de outro usuário', async () => {
  const account = await app
    .db('accounts')
    .insert({ name: 'Acc User #2', user_id: user2.id }, ['id']);

  const receivid = await request(app)
    .delete(`/api/accounts/${account[0].id}`)
    .set('authorization', `bearer ${user.token}`);

  expect(receivid.status).toBe(403);
  expect(receivid.body.error).toBe('Este recurso não pertence ao usuário');
});
