const request = require('supertest');
const app = require('../../src/app');

test('Deve receber token ao logar', async () => {
  const mail = `${Date.now()}@mail.com`;

  await app.services.users.create({
    name: 'joao',
    mail,
    password: '123456',
  });

  const receivid = await request(app)
    .post('/auth/singin')
    .send({ mail, password: '123456' });

  expect(receivid.status).toBe(200);
  expect(receivid.body).toHaveProperty('token');
});

test('Não deve autenticar usuário com senha errada', async () => {
  const mail = `${Date.now()}@mail.com`;

  await app.services.users.create({
    name: 'maria',
    mail,
    password: '123456',
  });

  const receivid = await request(app)
    .post('/auth/singin')
    .send({ mail, password: '654321' });

  expect(receivid.status).toBe(400);
  expect(receivid.body.error).toBe('Usuário ou senha inválida');
});

test('Não deve autenticar inexistente', async () => {
  const receivid = await request(app)
    .post('/auth/singin')
    .send({ mail: 'naoexiste@esse.email', password: '654321' });

  expect(receivid.status).toBe(400);
  expect(receivid.body.error).toBe('Usuário ou senha inválida');
});
