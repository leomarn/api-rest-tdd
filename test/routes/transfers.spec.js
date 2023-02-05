const request = require('supertest');
const app = require('../../src/app');

const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OTk5OTkwLCJuYW1lIjoiVXNlciAjMSIsIm1haWwiOiJ1c2VyMUBtYWlsLmNvbSJ9.GlSWfOFGsup9MMAWZcVxEj7QPtI-rCOd2x6wPCN2SpA';

beforeAll(async () => {
  // await app.db.migrate.rollback();
  // await app.db.migrate.latest();
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

describe('Ao tentar salvar uma transferência inválida...', () => {
  const validTransfer = {
    description: 'Regular Transfer',
    date: new Date(),
    ammount: 100,
    acc_ori_id: 999992,
    acc_des_id: 999993,
  };

  const template = async (newData, errorMessage) => {
    const received = await request(app)
      .post('/api/transfers')
      .set('authorization', `bearer ${token}`)
      .send({ ...validTransfer, ...newData });

    expect(received.status).toBe(400);
    expect(received.body.error).toBe(errorMessage);
  };

  it('Não deve inserir sem descrição', () => {
    template({ description: null }, 'Descrição é um atributo obrigatório');
  });

  it('Não deve inserir sem data', () => {
    template({ date: null }, 'Data é um atributo obrigatório');
  });

  it('Não deve inserir sem valor', () => {
    template({ ammount: null }, 'Valor é um atributo obrigatório');
  });

  it('Não deve inserir sem conta de origem', () => {
    template({ acc_ori_id: null }, 'Conta de origem é um atributo obrigatório');
  });

  it('Não deve inserir sem conta de destino', () => {
    template(
      { acc_des_id: null },
      'Conta de destino é um atributo obrigatório'
    );
  });

  it('Não deve inserir se as contas de origem e destino forem as mesmas', () => {
    template(
      { acc_des_id: 999992 },
      'Não é possível transferir de uma conta para ela mesma'
    );
  });

  it('Não deve inserir se as contas pertecerem a outro usuário', () => {
    template({ acc_des_id: 999994 }, 'Conta #999994 não pertence ao usuário');
  });
});

it('Deve retornar uma transferência por Id', async () => {
  const receivid = await request(app)
    .get('/api/transfers/999996')
    .set('authorization', `bearer ${token}`);

  expect(receivid.status).toBe(200);
  expect(receivid.body.description).toBe('Transfer #1');
});

describe('Ao alterar uma transferência válida...', () => {
  let transferId, output, input;

  it('Deve retornar o status 200 e os dados da transferência', async () => {
    const received = await request(app)
      .put('/api/transfers/999996')
      .set('authorization', `bearer ${token}`)
      .send({
        description: 'Transfer Updated',
        date: new Date(),
        ammount: 500,
        acc_ori_id: 999992,
        acc_des_id: 999993,
      });

    transferId = received.body.id;

    expect(received.status).toBe(200);
    expect(received.body.description).toBe('Transfer Updated');
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
    expect(output.ammount).toBe('-500.00');
    expect(output.acc_id).toBe(999992);
  });

  it('A transação de entrada deve ser positiva', async () => {
    expect(input.description).toBe('Transfer from acc #999992');
    expect(input.type).toBe('I');
    expect(input.ammount).toBe('500.00');
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

describe('Ao tentar alterar uma transferência inválida...', () => {
  const validTransfer = {
    description: 'Regular Transfer',
    date: new Date(),
    ammount: 100,
    acc_ori_id: 999992,
    acc_des_id: 999993,
  };

  const template = async (newData, errorMessage) => {
    const received = await request(app)
      .put('/api/transfers/999996')
      .set('authorization', `bearer ${token}`)
      .send({ ...validTransfer, ...newData });

    expect(received.status).toBe(400);
    expect(received.body.error).toBe(errorMessage);
  };

  it('Não deve inserir sem descrição', () => {
    template({ description: null }, 'Descrição é um atributo obrigatório');
  });

  it('Não deve inserir sem data', () => {
    template({ date: null }, 'Data é um atributo obrigatório');
  });

  it('Não deve inserir sem valor', () => {
    template({ ammount: null }, 'Valor é um atributo obrigatório');
  });

  it('Não deve inserir sem conta de origem', () => {
    template({ acc_ori_id: null }, 'Conta de origem é um atributo obrigatório');
  });

  it('Não deve inserir sem conta de destino', () => {
    template(
      { acc_des_id: null },
      'Conta de destino é um atributo obrigatório'
    );
  });

  it('Não deve inserir se as contas de origem e destino forem as mesmas', () => {
    template(
      { acc_des_id: 999992 },
      'Não é possível transferir de uma conta para ela mesma'
    );
  });

  it('Não deve inserir se as contas pertecerem a outro usuário', () => {
    template({ acc_des_id: 999994 }, 'Conta #999994 não pertence ao usuário');
  });
});

describe('Ao remover uma transferência', () => {
  it('Deve retornar o status 204', async () => {
    const received = await request(app)
      .delete('/api/transfers/999996')
      .set('authorization', `bearer ${token}`);

    expect(received.status).toBe(204);
  });

  it('O registro deve ter sido removido do banco', () => {
    return app
      .db('transfers')
      .where({ id: 999996 })
      .then((result) => {
        expect(result).toHaveLength(0);
      });
  });

  it('As transações associadas devem ter sido removidas', () => {
    return app
      .db('transactions')
      .where({ transfer_id: 999996 })
      .then((result) => {
        expect(result).toHaveLength(0);
      });
  });
});

it('Não deve retornar transferência de outro usuário', async () => {
  const received = await request(app)
    .get('/api/transfers/999997')
    .set('authorization', `bearer ${token}`);

  expect(received.status).toBe(403);
  expect(received.body.error).toBe('Este recurso não pertence ao usuário');
});
