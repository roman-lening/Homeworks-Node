import sequelize from "../config/db";
import { DataTypes } from "sequelize";

const App = sequelize.define(
  "App",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    size: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    tableName: "Apps",
    timestamps: false,
  },
);

export default App;
