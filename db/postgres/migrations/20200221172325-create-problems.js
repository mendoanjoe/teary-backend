module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface
      .createTable('problems', {
        id: {
          type: Sequelize.UUID,
          primaryKey: true,
          defaultValue: Sequelize.UUIDV4,
        },

        assignment_id: {
          allowNull: false,
          type: Sequelize.UUID,
        },
        title: {
          allowNull: false,
          type: Sequelize.STRING,
        },
        type: {
          allowNull: false,
          type: Sequelize.STRING,
        },
        body: {
          allowNull: false,
          type: Sequelize.TEXT,
        },
        scores: {
          allowNull: false,
          type: Sequelize.INTEGER,
        },
        time_limit: {
          allowNull: true,
          type: Sequelize.INTEGER,
        },
        memory_limit: {
          allowNull: true,
          type: Sequelize.INTEGER,
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
        queryInterface.addIndex('problems', ['assignment_id']);
      }),

  // eslint-disable-next-line no-unused-vars
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('problems');
  },
};
