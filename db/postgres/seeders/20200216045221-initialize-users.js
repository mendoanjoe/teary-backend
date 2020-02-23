const uuid = require('uuid/v4');

module.exports = {
  // eslint-disable-next-line no-unused-vars
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'users',
      [
        {
          id: uuid(),

          role_id: 'c1cf7552-4722-4d86-b0d6-67c27516bf87',
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
