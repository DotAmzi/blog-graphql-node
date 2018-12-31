require('dotenv').config({ load: '../' });

module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    dialect: 'mysql',
    pool: {
      max: 50,
      min: 1,
      idle: 200000,
      acquire: 200000
    },
    define: {
      timestamps: true,
      underscored: true
    },
    operatorsAliases: false
  },
  test: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE + '_test',
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false,
    pool: {
      max: 50,
      min: 1,
      idle: 200000,
      acquire: 200000
    },
    define: {
      timestamps: true,
      underscored: true
    },
    operatorsAliases: false
  },
  production: {
    url: process.env.CLEARDB_DATABASE_URL,
    dialect: 'mysql',
    define: {
      timestamps: true,
      underscored: true
    },
    operatorsAliases: false
  }
};