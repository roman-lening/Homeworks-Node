"use strict";

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable(
    "Apps",
    {
      id: {
        type: Sequelize.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      size: {
        type: Sequelize.DataTypes.FLOAT,
        allowNull: false,
      },
    },
    {
      tableName: "Apps",
      timestamps: false,
    },
  );
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable("Apps");
}
