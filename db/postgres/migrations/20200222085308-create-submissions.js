module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface
      .createTable('submissions', {
        id: {
          type: Sequelize.UUID,
          primaryKey: true,
          defaultValue: Sequelize.UUIDV4,
        },

        problem_id: {
          allowNull: false,
          type: Sequelize.UUID,
        },
        user_id: {
          allowNull: false,
          type: Sequelize.UUID,
        },
        bucket_name: {
          allowNull: false,
          type: Sequelize.STRING,
        },
        object_name: {
          allowNull: false,
          type: Sequelize.STRING,
        },
        scores: {
          allowNull: true,
          type: Sequelize.INTEGER,
        },
        status: {
          allowNull: false,
          type: Sequelize.STRING,
        },
        logs: {
          allowNull: true,
          type: Sequelize.TEXT,
        },

        created_at: {
          allowNull: true,
          type: Sequelize.DATE,
        },
        updated_at: {
          allowNull: true,
          type: Sequelize.DATE,
        },
        deleted_at: {
          allowNull: true,
          type: Sequelize.DATE,
        },
      })
      .then(() => {
        queryInterface.addIndex('submissions', ['problem_id', 'user_id']);
      }),

  // eslint-disable-next-line no-unused-vars
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('submissions');
  },
};
