const request = require('supertest');
const app = require('../../src/app');

const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODg4ODgwLCJuYW1lIjoiVXNlciAjMyIsIm1haWwiOiJ1c2VyM0BtYWlsLmNvbSJ9.aUPveH-BSo4Or7fMQKm2Do-POt9Ef0cST4rHDoYAlQY';

beforeAll(async () => {
  // await app.db.migrate.rollback();
  // await app.db.migrate.latest();
  await app.db.seed.run();
});

describe('Ao calcular o saldo do usuário...', () => {
  it('', async () => {});
  it('', async () => {});
  it('', async () => {});
  it('', async () => {});
  it('', async () => {});
  it('', async () => {});
  it('', async () => {});
});
