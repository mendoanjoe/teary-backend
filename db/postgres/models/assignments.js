module.exports = (sequelize, DataTypes) => {
  const Assignments = sequelize.define(
    'assignments',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      title: DataTypes.STRING,
      description: DataTypes.STRING,
      is_published: DataTypes.BOOLEAN,
      start_date: DataTypes.DATE,
      end_date: DataTypes.DATE,

      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
      deleted_at: DataTypes.DATE,
    },
    {
      createdAt: 'created_at',
      deletedAt: 'deleted_at',
      paranoid: true,
      updatedAt: 'updated_at',
    }
  );

  // eslint-disable-next-line no-unused-vars
  Assignments.associate = models => {
    // associations can be defined here
  };

  return Assignments;
};
