
'use strict';

module.exports = function(sequelize, DataTypes) {
  var posts = sequelize.define('posts', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    photo: {
      type: DataTypes.STRING(250),
      allowNull: true
    }
  }, {
    timestamps: false,
    underscored: true
  });

  posts.associate = models => {
    posts.belongsTo(models.users, { foreignKey: 'id_user'} );
    posts.belongsTo(models.tags, { foreignKey: 'id_tag'} );
    posts.hasMany(models.comments, { foreignKey: 'id_post'} );
  }

  return posts;
};
