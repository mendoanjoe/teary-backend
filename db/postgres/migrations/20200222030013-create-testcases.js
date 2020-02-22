module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface
      .createTable('testcases', {
        id: {
          type: Sequelize.UUID,
          primaryKey: true,
          defaultValue: Sequelize.UUIDV4,
        },

        problem_id: {
          allowNull: false,
          type: Sequelize.UUID,
        },
        judge_script: {
          allowNull: false,
          type: Sequelize.TEXT,
        },
        input: {
          allowNull: false,
          type: Sequelize.TEXT,
        },
        output: {
          allowNull: false,
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
        queryInterface.addIndex('testcases', ['problem_id']);
      }),

  // eslint-disable-next-line no-unused-vars
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('testcases');
  },
};
