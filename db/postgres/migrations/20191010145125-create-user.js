module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface
      .createTable('users', {
        id: {
          type: Sequelize.UUID,
          primaryKey: true,
          defaultValue: Sequelize.UUIDV4,
        },
        role_id: {
          allowNull: false,
          type: Sequelize.UUID,
        },

        nim: {
          allowNull: false,
          type: Sequelize.STRING,
        },
        email: {
          allowNull: false,
          type: Sequelize.STRING,
        },
        name: {
          allowNull: true,
          type: Sequelize.STRING,
        },
        password: {
          allowNull: true,
          type: Sequelize.STRING,
        },
        bucket_name: {
          allowNull: false,
          type: Sequelize.STRING,
        },
        google_access_token: {
          allowNull: true,
          type: Sequelize.STRING,
        },
        google_refresh_token: {
          allowNull: true,
          type: Sequelize.STRING,
        },
        google_token_expiry_date: {
          allowNull: true,
          type: Sequelize.DATE,
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
        queryInterface.addIndex('users', ['email', 'role_id']);
      }),

  // eslint-disable-next-line no-unused-vars
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('users');
  },
};
