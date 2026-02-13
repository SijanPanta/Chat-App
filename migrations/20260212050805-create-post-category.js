"use strict";
/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("PostCategories", {
    postId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "posts",
        key: "postId",
      },
      onDelete: "CASCADE",
    },
    categoryId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "Categories",
        key: "id",
      },
      onDelete: "CASCADE",
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
  await queryInterface.dropTable("PostCategories");
}
