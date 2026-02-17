'use strict';
/** @type {import('sequelize-cli').Migration} */

  export async function up(queryInterface, Sequelize) {
    await queryInterface.createTable('Comments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      content:{
        type:Sequelize.TEXT,
        allowNull:false
      },
      postId: {
        type: Sequelize.INTEGER,
        allowNull:false,
        reference:{
          model:'Post',
          key:'postId'
        },
        onDelete:'CASCADE'
      },
      userId: {
        type: Sequelize.STRING,
        allowNull:false,
        reference:{
          model:'User',
          key:'userId'
        },
        onDelete:'CASCADE'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  }
  export async function down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Comments');
  }