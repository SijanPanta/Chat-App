// 'use strict';

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("posts", {
    postId: {
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      type: Sequelize.INTEGER,
    },
    userId: {
      type: Sequelize.STRING,
      allowNull: false,
      references: {
        model: "users",
        key: "userId",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    content: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    images: {
      type: Sequelize.JSON,
      defaultValue: [],
    },
    likesCount: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  });
}
export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable("posts");
}
