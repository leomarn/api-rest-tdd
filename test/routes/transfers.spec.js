const request = require('supertest');
const app = require('../../src/app');

const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OTk5OTkwLCJuYW1lIjoiVXNlciAjMSIsIm1haWwiOiJ1c2VyMUBtYWlsLmNvbSJ9.GlSWfOFGsup9MMAWZcVxEj7QPtI-rCOd2x6wPCN2SpA';

beforeAll(async () => {
  await app.db.migrate.rollback();
  await app.db.migrate.latest();
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

it('Deve inserir uma transferência com sucesso', async () => {
  const received = await request(app)
    .post('/api/transfers')
    .set('authorization', `bearer ${token}`)
    .send({
      description: 'Regular Transfer',
      date: new Date(),
      ammount: 100,
      acc_ori_id: 999992,
      acc_des_id: 999993,
    });

  expect(received.status).toBe(201);
  expect(received.body.description).toBe('Regular Transfer');

  const transactions = await app
    .db('transactions')
    .where({ transfer_id: received.body.id });
  expect(transactions).toHaveLength(2);
  expect(transactions[0].description).toBe('Transfer to acc #999993');
  expect(transactions[1].description).toBe('Transfer from acc #999992');
  expect(transactions[0].ammount).toBe('-100.00');
  expect(transactions[1].ammount).toBe('100.00');
  expect(transactions[0].acc_id).toBe(999992);
  expect(transactions[1].acc_id).toBe(999993);
});

describe('Ao salvar uma transferência válida...', () => {
  let transferId, output, input;

  it('Deve retornar o status 201 e os dados da transferência', async () => {
    const received = await request(app)
      .post('/api/transfers')
      .set('authorization', `bearer ${token}`)
      .send({
        description: 'Regular Transfer',
        date: new Date(),
        ammount: 100,
        acc_ori_id: 999992,
        acc_des_id: 999993,
      });

    transferId = received.body.id;

    expect(received.status).toBe(201);
    expect(received.body.description).toBe('Regular Transfer');
  });

  it('As transações equivalentes devem ter sido geradas', async () => {
    const transactions = await app
      .db('transactions')
      .where({ transfer_id: transferId })
      .orderBy('ammount');

    [output, input] = transactions;

    expect(transactions).toHaveLength(2);
  });

  it('A transação de saída deve ser negativa', async () => {
    expect(output.description).toBe('Transfer to acc #999993');
    expect(output.type).toBe('O');
    expect(output.ammount).toBe('-100.00');
    expect(output.acc_id).toBe(999992);
  });

  it('A transação de entrada deve ser positiva', async () => {
    expect(input.description).toBe('Transfer from acc #999992');
    expect(input.type).toBe('I');
    expect(input.ammount).toBe('100.00');
    expect(input.acc_id).toBe(999993);
  });

  it('Ambas devem referenciar a transferência que as originou', async () => {
    expect(output.transfer_id).toBe(transferId);
    expect(input.transfer_id).toBe(transferId);
  });

  it('Ambas devem estar com status de realizadas', async () => {
    expect(output.status).toBe(true);
    expect(input.status).toBe(true);
  });
});
