module.exports = (sequelize, DataTypes) => {
  const Testcases = sequelize.define(
    'testcases',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      problem_id: DataTypes.UUID,
      judge_script: DataTypes.TEXT,
      input: DataTypes.TEXT,
      output: DataTypes.TEXT,

      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
      deleted_at: DataTypes.DATE,
    },
    {
      createdAt: 'created_at',
      deletedAt: 'deleted_at',
      paranoid: true,
      updatedAt: 'updated_at',

      indexes: [{ fields: ['problem_id'] }],
    }
  );

  // eslint-disable-next-line no-unused-vars
  Testcases.associate = models => {
    // associations can be defined here
  };

  return Testcases;
};
