module.exports = (sequelize, DataTypes) => {
  const Submissions = sequelize.define(
    'submissions',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      problem_id: DataTypes.UUID,
      user_id: DataTypes.UUID,
      scores: DataTypes.INTEGER,
      status: DataTypes.STRING,
      logs: DataTypes.TEXT,

      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
      deleted_at: DataTypes.DATE,
    },
    {
      createdAt: 'created_at',
      deletedAt: 'deleted_at',
      paranoid: true,
      updatedAt: 'updated_at',

      indexes: [{ fields: ['problem_id', 'user_id'] }],
    }
  );

  // eslint-disable-next-line no-unused-vars
  Submissions.associate = models => {
    // associations can be defined here
  };

  return Submissions;
};
