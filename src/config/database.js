require('dotenv').config();

const useSSL = process.env.DB_SSL === 'true';

module.exports = {
  dialect: 'mariadb',
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT) || 3306,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,

  define: {
    timestamps: true,
    underscored: false,
    underscoredAll: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    timezone: '-03:00',
  },

  dialectOptions: {
    // MySQL 8 / caching_sha2_password: sem isso o driver recusa o handshake.
    allowPublicKeyRetrieval: true,
    ...(useSSL
      ? {
          ssl: {
            ca: process.env.DB_SSL_CA.replace(/\\n/g, '\n'),
            rejectUnauthorized: true,
            checkServerIdentity: () => undefined,
          },
        }
      : {}),
  },
};
