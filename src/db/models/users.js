
'use strict';

import { genSaltSync, hashSync, compareSync } from 'bcryptjs';

module.exports = function(sequelize, DataTypes) {
  var users = sequelize.define('users', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(250),
      allowNull: false
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    photo: {
      type: DataTypes.STRING(250),
      allowNull: true
    }
  }, {
    timestamps: false,
    underscored: true,
    hooks: {
      beforeCreate: (users, options) => {
        const salt = genSaltSync();
        users.password = hashSync(users.password, salt);
      },
      beforeUpdate: (users, options) => {
        if (users.changed('password')){
          const salt = genSaltSync();
          users.password = hashSync(users.password, salt);
        }
      }
    }
  });

  users.prototype.isPassword = (encodedPassword, password) => {
    return compareSync(password, encodedPassword)
  }

  users.associate = models => {
    users.hasMany(models.posts, { foreignKey: 'id_user'} );    
    users.hasMany(models.comments, { foreignKey: 'id_user'} );
  }

  return users;
};
