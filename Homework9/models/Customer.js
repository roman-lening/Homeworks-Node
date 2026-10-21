import sequelize from "../config/db.js";
import { DataTypes } from "sequelize";

const Customer = sequelize.define("Customer", {
  id: {
    autoIncrement: true,
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  mustChangePassword: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  role: {
    type: DataTypes.ENUM("user", "admin"),
    allowNull: false,
    defaultValue: "user",
  },
});

export default Customer;
