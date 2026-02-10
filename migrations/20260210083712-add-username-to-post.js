export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn("posts", "userName", {
    type: Sequelize.STRING,
    allowNull: false,
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.removeColumn("posts", "userName");
}
