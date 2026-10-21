"use strict";

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("customers", {
    id: {
      autoIncrement: true,
      type: Sequelize.DataTypes.INTEGER,
      primaryKey: true,
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
  });
}
export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable("customers");
}
