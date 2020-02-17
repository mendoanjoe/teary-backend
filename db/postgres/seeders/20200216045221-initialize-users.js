const uuid = require('uuid/v4');

module.exports = {
  // eslint-disable-next-line no-unused-vars
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'users',
      [
        {
          id: uuid(),

          role_id: 'e5112e4d-d7e7-4f6d-aa5d-8b62900d02f3',
          nim: '1301160479',
          email: 'nurcahyo@student.telkomuniversity.ac.id',
          name: 'Wisnu Adi Nurcahyo',
          bucket_name: 'teary',

          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  // eslint-disable-next-line no-unused-vars
  down: (queryInterface, Sequelize) => {},
};
