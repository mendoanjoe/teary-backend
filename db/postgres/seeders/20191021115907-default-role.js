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
            enables: [],
            disables: ['^.* ^.*'],
          }),

          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 'c1cf7552-4722-4d86-b0d6-67c27516bf87',

          deletable: false,
          name: 'Admin',
          rules: JSON.stringify({
            enables: ['^.* ^.*'],
            disables: [],
          }),

          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 'd7bb9f4f-a543-4fef-bd84-676c78eab891',

          deletable: true,
          name: 'Lecturer',
          rules: JSON.stringify({
            enables: ['^.* ^.*'],
            disables: ['^.* /roles'],
          }),

          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: '1098731b-d721-4d95-aa29-6175f89da08a',

          deletable: true,
          name: 'Teaching Assistant',
          rules: JSON.stringify({
            enables: ['^.* ^.*'],
            disables: ['^.* /roles', '^.* /users'],
          }),

          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 'f76352cf-d946-4d19-b3a1-17c4f792151c',

          deletable: true,
          name: 'Student',
          rules: JSON.stringify({
            enables: ['^.* ^.*'],
            disables: [
              '^.* /roles',
              '^.* /testcases',
              '^.* /users',
              'POST /assignments',
              '(DELETE|PUT) /assignments/*',
              'POST /problems',
              '(DELETE|PUT) /problems/*',
            ],
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
          [Sequelize.Op.in]: [
            'e5112e4d-d7e7-4f6d-aa5d-8b62900d02f3',
            'c1cf7552-4722-4d86-b0d6-67c27516bf87',
            'd7bb9f4f-a543-4fef-bd84-676c78eab891',
            '1098731b-d721-4d95-aa29-6175f89da08a',
            'f76352cf-d946-4d19-b3a1-17c4f792151c',
          ],
        },
      },
      {}
    );
  },
};
