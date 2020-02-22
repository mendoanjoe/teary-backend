module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .createTable('roles', {
        id: {
          allowNull: false,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
          type: Sequelize.UUID,
        },

        deletable: {
          defaultValue: true,
          type: Sequelize.BOOLEAN,
        },
        name: {
          allowNull: false,
          type: Sequelize.STRING,
        },
        rules: {
          allowNull: false,
          type: Sequelize.JSONB,
        },

        created_at: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        updated_at: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        deleted_at: {
          allowNull: true,
          type: Sequelize.DATE,
        },
      })
      .then(() => {
        queryInterface.addIndex('roles', ['name']);
      });
  },

  // eslint-disable-next-line no-unused-vars
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('roles');
  },
};
