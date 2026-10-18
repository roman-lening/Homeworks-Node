"use strict";

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("Books", {
    id: {
      type: Sequelize.DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    title: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
    },
    author: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
    },
    year: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    createdAt: {
      type: Sequelize.DataTypes.DATE,
      allowNull: false,
    },

    updatedAt: {
      type: Sequelize.DataTypes.DATE,
      allowNull: false,
    },
  });
}
export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable("Books");
}
