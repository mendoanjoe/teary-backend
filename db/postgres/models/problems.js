module.exports = (sequelize, DataTypes) => {
  const Problems = sequelize.define(
    'problems',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      assignment_id: DataTypes.UUID,
      title: DataTypes.STRING,
      type: DataTypes.STRING,
      body: DataTypes.TEXT,
      scores: DataTypes.INTEGER,
      time_limit: DataTypes.INTEGER,
      memory_limit: DataTypes.INTEGER,

      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
      deleted_at: DataTypes.DATE,
    },
    {
      createdAt: 'created_at',
      deletedAt: 'deleted_at',
      paranoid: true,
      updatedAt: 'updated_at',

      indexes: [{ fields: ['assignment_id'] }],
    }
  );

  // eslint-disable-next-line no-unused-vars
  Problems.associate = models => {
    // associations can be defined here
  };

  return Problems;
};
