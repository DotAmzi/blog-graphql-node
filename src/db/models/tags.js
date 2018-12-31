
'use strict';

module.exports = function(sequelize, DataTypes) {
  var tags = sequelize.define('tags', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(200),
      allowNull: false
    }
  }, {
    timestamps: false,
    underscored: true
  });

  tags.associate = models => {
    tags.hasMany(models.posts, { foreignKey: 'id_tag'} );
  }

  return tags;
};
