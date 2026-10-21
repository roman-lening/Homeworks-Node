"use strict";

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn("customers", "mustChangePassword", {
    type: Sequelize.DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.removeColumn("customers", "mustChangePassword");
}