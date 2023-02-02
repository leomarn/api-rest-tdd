module.exports = {
  test: {
    client: 'pg',
    version: '15.0',
    connection: {
      host: 'localhost',
      user: 'admin',
      port: '5500',
      password: '123456789',
      database: 'backend-typescript-api',
    },
    migrations: {
      directory: 'src/migrations',
    },
    seeds: {
      directory: 'src/migrations/seeds',
    },
  },
};
