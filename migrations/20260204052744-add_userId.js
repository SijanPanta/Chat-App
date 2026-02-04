import { v4 as uuidv4 } from "uuid";

export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn("users", "userId", {
    type: Sequelize.STRING,
    allowNull: true,
  });

  // Generate random userId for existing users
  const [users] = await queryInterface.sequelize.query(
    "SELECT id FROM users WHERE userId IS NULL;",
  );

  for (const user of users) {
    const randomUserId = uuidv4();
    await queryInterface.sequelize.query(
      "UPDATE users SET userId = ? WHERE id = ?",
      { replacements: [randomUserId, user.id] },
    );
  }

  // Make userId non-nullable after populating
  await queryInterface.changeColumn("users", "userId", {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.removeColumn("users", "userId");
}
