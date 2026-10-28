import configData from "./config.js";
import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import { readFileSync } from "node:fs";

dotenv.config();

const { database, username, password, host, port, dialect } =
  configData.development;

const sequelize = new Sequelize(database, username, password, {
  host,
  port,
  dialect,
  dialectOptions: {
    ssl: {
      ca: readFileSync(process.env.DB_SSL_CA, "utf8"),
      rejectUnauthorized: true,
    },
  },
});

export default sequelize;
