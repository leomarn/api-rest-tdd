// const supertest = require('supertest');
// import supertest from 'supertest';

// const request = supertest('http://localhost:3001');

test('Devo conhecer o básico das assertivas', () => {
  let number = null;
  expect(number).toBeNull();

  number = 10;
  expect(number).not.toBeNull();
  expect(number).toBe(10);
  expect(number).toEqual(10);
  // maior que 9
  expect(number).toBeGreaterThan(9);
  // menor que 11
  expect(number).toBeLessThan(11);
});

test('Devo saber trabalhar com objetos', () => {
  const obj = { nome: 'jorge', email: 'jorge@email.com' };
  const obj2 = { nome: 'jorge', email: 'jorge@email.com' };

  expect(obj).toHaveProperty('email');
  expect(obj).toHaveProperty('email', 'jorge@email.com');
  expect(obj.nome).toBe('jorge');

  // expect(obj).toBe(obj2);
  expect(obj).toEqual(obj2);
});

// test('Deve responder na porta 3001', async () => {
//   const res = await request.get('/');

//   expect(res.status).toBe(200);
// });
