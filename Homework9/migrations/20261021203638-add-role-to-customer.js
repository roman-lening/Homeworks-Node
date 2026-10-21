"use strict";

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn("customers", "role", {
    type: Sequelize.DataTypes.ENUM("user", "admin"),
    allowNull: false,
    defaultValue: "user",
  });
}
export async function down(queryInterface, Sequelize) {
  await queryInterface.removeColumn("customers", "role");
}
