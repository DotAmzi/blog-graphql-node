
'use strict';

module.exports = function(sequelize, DataTypes) {
  var comments = sequelize.define('comments', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    comment: {
      type: DataTypes.STRING(400),
      allowNull: false
    }
  }, {
    timestamps: false,
    underscored: true
  });

  comments.associate = models => {
    comments.belongsTo(models.users, { foreignKey: 'id_user'} );
    comments.belongsTo(models.posts, { foreignKey: 'id_post'} );
  }

  return comments;
};
