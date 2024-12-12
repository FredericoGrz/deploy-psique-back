// Carrega o dotenv apenas no ambiente de desenvolvimento
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

module.exports = {
  apps: [
    {
      name: "app",
      script: "./dist/server.js",
      instances: "max",
      exec_mode: "cluster",
      env: {
        NODE_ENV: process.env.ENVIRONMENT,
        PORT: process.env.PORT,
        DATABASE_URL: process.env.DB_CONN,
        AUTH_SECRET: process.env.AUTH_SECRET,
      },
      env_production: {
        NODE_ENV: process.env.ENVIRONMENT,
        PORT: process.env.PORT,
        DATABASE_URL: process.env.DB_CONN,
        AUTH_SECRET: process.env.AUTH_SECRET,
      },
    },
  ],
};
