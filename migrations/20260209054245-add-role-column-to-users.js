export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn("users", "role", {
    type: Sequelize.STRING,
    allowNull: false,
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.removeColumn("users", "role");
}
