const response = require('supertest');

const app = require('../src/app');

test('Deve listar todos os usuários', async () => {
  const received = await response(app).get('/users');

  expect(received.status).toBe(200);
  expect(received.body).toHaveLength(1);
  expect(received.body[0]).toHaveProperty('nome', 'Tom Riddle');
});

test('Deve inserir usuário com sucesso', async () => {
  const received = await response(app).post('/users').send({
    nome: 'Ron Weasley',
    email: 'ron@weasley.com',
  });
  expect(received.status).toBe(201);
  expect(received.body).toHaveProperty('nome', 'Ron Weasley');
});
