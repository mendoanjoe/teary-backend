module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define(
    'users',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      role_id: DataTypes.UUID,
      nim: DataTypes.STRING,
      email: DataTypes.STRING,
      name: DataTypes.STRING,
      password: DataTypes.STRING,
      bucket_name: DataTypes.STRING,
      google_access_token: DataTypes.STRING,
      google_refresh_token: DataTypes.STRING,
      google_token_expiry_date: DataTypes.DATE,

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
          fields: ['email'],
          unique: true,
        },
      ],
    }
  );

  // eslint-disable-next-line no-unused-vars
  Users.associate = models => {
    // associations can be defined here
  };

  return Users;
};
