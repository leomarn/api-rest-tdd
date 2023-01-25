const request = require('supertest');
const jwt = require('jwt-simple');
const app = require('../../src/app');

let user;
let user2;
let accUser;
let accUser2;

beforeAll(async () => {
  await app.db('transactions').del();
  await app.db('accounts').del();
  await app.db('users').del();
  const users = await app.db('users').insert(
    [
      {
        name: 'User #1',
        mail: 'user@mail.com',
        password:
          '$2a$10$uCIFQjASyROIYFmw/D7FKOkKjfv.NGHluwvh76osHXhmHZ5qNTupa',
      },
      {
        name: 'User #2',
        mail: 'user2@mail.com',
        password:
          '$2a$10$uCIFQjASyROIYFmw/D7FKOkKjfv.NGHluwvh76osHXhmHZ5qNTupa',
      },
    ],
    '*'
  );
  [user, user2] = users;
  delete user.password;
  user.token = jwt.encode(user, 'Segredo!');

  const accs = await app.db('accounts').insert(
    [
      { name: 'Acc #1', user_id: user.id },
      { name: 'Acc #2', user_id: user2.id },
    ],
    '*'
  );
  [accUser, accUser2] = accs;
});

test('Deve listar apenas as transações do usuário', async () => {
  await app.db('transactions').insert([
    {
      description: 'T1',
      date: new Date(),
      ammount: 100,
      type: 'I',
      acc_id: accUser.id,
    },
    {
      description: 'T2',
      date: new Date(),
      ammount: 300,
      type: 'O',
      acc_id: accUser2.id,
    },
  ]);

  const received = await request(app)
    .get('/api/transactions')
    .set('authorization', `bearer ${user.token}`);

  expect(received.status).toBe(200);
  expect(received.body).toHaveLength(1);
  expect(received.body[0].description).toBe('T1');
});

test('Deve inserir uma transação com sucesso', async () => {
  const received = await request(app)
    .post('/api/transactions')
    .set('authorization', `bearer ${user.token}`)
    .send({
      description: 'New T',
      date: new Date(),
      ammount: 400,
      type: 'I',
      acc_id: accUser.id,
    });

  expect(received.status).toBe(201);
  expect(received.body[0].acc_id).toBe(accUser.id);
});

it('Transações de entrada devem ser positivas', async () => {
  const received = await request(app)
    .post('/api/transactions')
    .set('authorization', `bearer ${user.token}`)
    .send({
      description: 'New T',
      date: new Date(),
      ammount: -400,
      type: 'I',
      acc_id: accUser.id,
    });

  expect(received.status).toBe(201);
  expect(received.body[0].acc_id).toBe(accUser.id);
  expect(received.body[0].ammount).toBe('400.00');
});

it('Transações de saídas devem ser negativas', async () => {
  const received = await request(app)
    .post('/api/transactions')
    .set('authorization', `bearer ${user.token}`)
    .send({
      description: 'New T',
      date: new Date(),
      ammount: 400,
      type: 'O',
      acc_id: accUser.id,
    });

  expect(received.status).toBe(201);
  expect(received.body[0].acc_id).toBe(accUser.id);
  expect(received.body[0].ammount).toBe('-400.00');
});

it('Não deve inserir uma transação sem descrição', async () => {
  const received = await request(app)
    .post('/api/transactions')
    .set('authorization', `bearer ${user.token}`)
    .send({
      date: new Date(),
      ammount: 400,
      type: 'O',
      acc_id: accUser.id,
    });

  expect(received.status).toBe(400);
  expect(received.body.error).toBe('Descrição é um atributo obrigatório');
});

it('Não deve inserir uma transação sem valor', async () => {
  const received = await request(app)
    .post('/api/transactions')
    .set('authorization', `bearer ${user.token}`)
    .send({
      description: 'New T',
      date: new Date(),
      type: 'O',
      acc_id: accUser.id,
    });

  expect(received.status).toBe(400);
  expect(received.body.error).toBe('Valor é um atributo obrigatório');
});

it('Não deve inserir uma transação sem data', async () => {
  const received = await request(app)
    .post('/api/transactions')
    .set('authorization', `bearer ${user.token}`)
    .send({
      description: 'New T',
      ammount: 400,
      type: 'O',
      acc_id: accUser.id,
    });

  expect(received.status).toBe(400);
  expect(received.body.error).toBe('Data é um atributo obrigatório');
});

it('Não deve inserir uma transação sem conta', async () => {
  const received = await request(app)
    .post('/api/transactions')
    .set('authorization', `bearer ${user.token}`)
    .send({
      description: 'New T',
      date: new Date(),
      ammount: 400,
      type: 'O',
    });

  expect(received.status).toBe(400);
  expect(received.body.error).toBe('Conta é um atributo obrigatório');
});

it('Não deve inserir uma transação sem tipo', async () => {
  const received = await request(app)
    .post('/api/transactions')
    .set('authorization', `bearer ${user.token}`)
    .send({
      description: 'New T',
      date: new Date(),
      ammount: 400,
      acc_id: accUser.id,
    });

  expect(received.status).toBe(400);
  expect(received.body.error).toBe('Tipo é um atributo obrigatório');
});

it('Não deve inserir uma transação sem tipo inválido', async () => {
  const received = await request(app)
    .post('/api/transactions')
    .set('authorization', `bearer ${user.token}`)
    .send({
      description: 'New T',
      date: new Date(),
      ammount: 400,
      type: 'A',
      acc_id: accUser.id,
    });

  expect(received.status).toBe(400);
  expect(received.body.error).toBe('Tipo é um atributo inválido');
});

it('Deve retornar uma transação por ID', async () => {
  const transaction = await app.db('transactions').insert(
    {
      description: 'T Id',
      date: new Date(),
      ammount: 400,
      type: 'I',
      acc_id: accUser.id,
    },
    ['id']
  );

  const received = await request(app)
    .get(`/api/transactions/${transaction[0].id}`)
    .set('authorization', `bearer ${user.token}`);

  expect(received.status).toBe(200);
  expect(received.body.id).toBe(transaction[0].id);
  expect(received.body.description).toBe('T Id');
});

it('Deve alterar uma transação', async () => {
  const transaction = await app.db('transactions').insert(
    {
      description: 'T to Update',
      date: new Date(),
      ammount: 200,
      type: 'I',
      acc_id: accUser.id,
    },
    ['id']
  );

  const received = await request(app)
    .put(`/api/transactions/${transaction[0].id}`)
    .send({ description: 'T Updated' })
    .set('authorization', `bearer ${user.token}`);

  expect(received.status).toBe(200);
  expect(received.body.description).toBe('T Updated');
});

it('Deve remover uma transação', async () => {
  const transaction = await app.db('transactions').insert(
    {
      description: 'T to delete',
      date: new Date(),
      ammount: 200,
      type: 'I',
      acc_id: accUser.id,
    },
    ['id']
  );

  const received = await request(app)
    .delete(`/api/transactions/${transaction[0].id}`)
    .set('authorization', `bearer ${user.token}`);

  expect(received.status).toBe(204);
});

it('Não deve remover uma transação de outro usuário', async () => {
  const transaction = await app.db('transactions').insert(
    {
      description: 'T to delete',
      date: new Date(),
      ammount: 200,
      type: 'I',
      acc_id: accUser2.id,
    },
    ['id']
  );

  const received = await request(app)
    .delete(`/api/transactions/${transaction[0].id}`)
    .set('authorization', `bearer ${user.token}`);

  expect(received.status).toBe(403);
  expect(received.body.error).toBe('Este recurso não pertence ao usuário');
});
