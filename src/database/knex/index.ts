const config = require("../../../knexfile");
import knex from "knex";

const environment = process.env.ENVIRONMENT;

if (!environment) {
  throw new Error("ENVIRONMENT variável de ambiente não está definida");
}

const connection = knex(config[environment]);

export default connection;
