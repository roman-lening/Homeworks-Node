import configData from "./config.js";
import { Sequelize } from "sequelize";

const { database, username, password, host, dialect } = configData.development;

const sequelize = new Sequelize(database, username, password, {
  host,
  dialect,
});

export default sequelize;