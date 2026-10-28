"use strict";

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("users", {
    id: {
      type: Sequelize.DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    username: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: Sequelize.DataTypes.ENUM("user", "admin"),
      allowNull: false,
      defaultValue: "user",
    },
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable("users");
}
