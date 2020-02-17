module.exports = {
  // eslint-disable-next-line no-unused-vars
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'roles',
      [
        {
          id: 'e5112e4d-d7e7-4f6d-aa5d-8b62900d02f3',

          deletable: false,
          name: 'Default',
          rules: JSON.stringify({
            enables: ['^.* ^.*'],
            disables: [],
          }),

          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete(
      'roles',
      {
        id: {
          [Sequelize.Op.in]: ['e5112e4d-d7e7-4f6d-aa5d-8b62900d02f3'],
        },
      },
      {}
    );
  },
};
