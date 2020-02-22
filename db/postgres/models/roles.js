module.exports = (sequelize, DataTypes) => {
  const Roles = sequelize.define(
    'roles',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      deletable: DataTypes.BOOLEAN,
      name: DataTypes.STRING,
      rules: DataTypes.JSONB,

      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
      deleted_at: DataTypes.DATE,
    },
    {
      createdAt: 'created_at',
      deletedAt: 'deleted_at',
      paranoid: true,
      updatedAt: 'updated_at',

      indexes: [
        {
          fields: ['name'],
          unique: true,
        },
      ],
    }
  );

  // eslint-disable-next-line no-unused-vars
  Roles.associate = models => {
    // associations can be defined here
  };

  return Roles;
};
