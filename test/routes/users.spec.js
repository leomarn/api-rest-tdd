const response = require('supertest');

const app = require('../../src/app');

test('Deve listar todos os usuários', async () => {
  const received = await response(app).get('/users');

  expect(received.status).toBe(200);
  expect(received.body.length).toBeGreaterThan(0);
});

test('Deve inserir usuário com sucesso', async () => {
  const received = await response(app).post('/users').send({
    name: 'Severus Snapes3',
    mail: 'severus3@snapes.com',
    password: '123456',
  });
  expect(received.status).toBe(201);
  expect(received.body).toHaveProperty('name', 'Severus Snapes3');
});
