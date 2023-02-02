const request = require('supertest');
const app = require('../../src/app');

const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OTk5OTkwLCJuYW1lIjoiVXNlciAjMSIsIm1haWwiOiJ1c2VyMUBtYWlsLmNvbSJ9.GlSWfOFGsup9MMAWZcVxEj7QPtI-rCOd2x6wPCN2SpA';

beforeAll(async () => {
  await app.db.seed.run();
});

it('Deve listar apenas as transferências do usuário', async () => {
  const received = await request(app)
    .get('/api/transfers')
    .set('authorization', `bearer ${token}`);

  expect(received.status).toBe(200);
  expect(received.body).toHaveLength(1);
  expect(received.body[0].description).toBe('Transfer #1');
});
