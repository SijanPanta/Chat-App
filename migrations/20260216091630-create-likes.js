
  export async function up(queryInterface, Sequelize) {
    await queryInterface.createTable('Likes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'users', // Name of the source table
          key: 'userId'
        },
        onDelete: 'CASCADE' // If user is deleted, delete the like
      },
      postId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'posts', // Name of the source table
          key: 'postId'
        },
        onDelete: 'CASCADE' // If post is deleted, delete the like
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

    // ADD THE COMPOSITE UNIQUE INDEX HERE
    await queryInterface.addIndex('Likes', ['userId', 'postId'], {
      unique: true,
      name: 'unique_user_post_like'
    });
  }

  export async function down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Likes');
  }
