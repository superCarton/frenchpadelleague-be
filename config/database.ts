export default ({ env }) => {
  return {
    connection: {
      client: 'postgres',
      connection: {
        connectionString: env('DATABASE_URL'),
        ssl: {
          rejectUnauthorized: false,
        },
      },
      pool: {
        min: 2,
        max: 10, // Peut descendre à 5 ou 7 si besoin
      },
    },
  };
};
