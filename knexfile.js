const path = require("path");
const { Extension } = require("typescript");
require("dotenv/config");

module.exports = {
  development: {
    client: "pg",
    connection: process.env.DB_CONN,
    migrations: {
      directory: path.resolve(
        __dirname,
        "src",
        "database",
        "knex",
        "migrations"
      ),
      extension: "ts",
    },
    seeds: {
      directory: path.resolve(__dirname, "src", "database", "knex", "seeds"),
      extension: "ts",
    },
  },
  production: {
    client: "pg",
    connection: process.env.DB_CONN, // Utilize variáveis de ambiente para produção
    migrations: {
      directory: path.resolve(
        __dirname,
        "src",
        "database",
        "knex",
        "migrations"
      ),
      extension: "ts",
    },
    seeds: {
      directory: path.resolve(__dirname, "src", "database", "knex", "seeds"),
      extension: "ts",
    },
    useNullAsDefault: true,
  },
};
