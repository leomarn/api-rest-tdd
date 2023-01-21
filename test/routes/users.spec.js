const request = require('supertest');
const jwt = require('jwt-simple');
const app = require('../../src/app');

const email = `${Date.now()}severus3@snapes.com`;

beforeAll(async () => {
  const receivid = await app.services.users.create({
    name: 'user account',
    mail: `${Date.now()}test@mail.com`,
    password: '12345',
  });
  user = { ...receivid[0] };
  user.token = jwt.encode(user, 'Segredo!');
});

test('Deve listar todos os usuários', async () => {
  const received = await request(app)
    .get('/users')
    .set('authorization', `bearer ${user.token}`);

  expect(received.status).toBe(200);
  expect(received.body.length).toBeGreaterThan(0);
});

test('Deve inserir usuário com sucesso', async () => {
  const received = await request(app)
    .post('/users')
    .set('authorization', `bearer ${user.token}`)
    .send({
      name: 'Severus Snapes3',
      mail: email,
      password: '123456',
    });
  expect(received.status).toBe(201);
  expect(received.body.name).toBe('Severus Snapes3');
  expect(received.body).not.toHaveProperty('password');
});

test('Deve armazenar senha criptografada', async () => {
  const received = await request(app)
    .post('/users')
    .set('authorization', `bearer ${user.token}`)
    .send({
      name: 'Severus Snapes3',
      mail: `${Date.now()}severus3@snapes.com`,
      password: '123456',
    });
  expect(received.status).toBe(201);

  const { id } = received.body;
  const userDB = await app.services.users.findOne({ id });
  expect(userDB.password).not.toBeUndefined();
  expect(userDB.password).not.toBe('123456');
});

test('Não deve inserir usuário sem nome', async () => {
  const receivid = await request(app)
    .post('/users')
    .set('authorization', `bearer ${user.token}`)
    .send({ mail: 'test@gmail.com', password: '12345' });

  expect(receivid.status).toBe(400);
  expect(receivid.body.error).toBe('Nome é um atributo obrigatório');
});

test('Não deve inserir usuário sem email', async () => {
  const received = await request(app)
    .post('/users')
    .set('authorization', `bearer ${user.token}`)
    .send({ name: 'test', password: '12345' });

  expect(received.status).toBe(400);
  expect(received.body.error).toBe('Email é um atributo obrigatorio');
});

test('Não deve inserir usuário sem senha', async (done) => {
  const received = await request(app)
    .post('/users')
    .set('authorization', `bearer ${user.token}`)
    .send({ name: 'test', mail: '12345@test.com' });

  expect(received.status).toBe(400);
  expect(received.body.error).toBe('Senha é um atributo obrigatorio');
  done();
});

test('Não deve inserir usuário com email existente', async () => {
  const received = await request(app)
    .post('/users')
    .set('authorization', `bearer ${user.token}`)
    .send({
      name: 'Severus Snapes3',
      mail: email,
      password: '123456',
    });

  expect(received.status).toBe(400);
  expect(received.body.error).toBe('Já existe usuário com esse email.');
});
