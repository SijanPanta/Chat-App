
export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn('Comments', 'parentId', {
    type: Sequelize.INTEGER,
    allowNull:true
  })
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.removeColumn('Comments', 'parentId')
}