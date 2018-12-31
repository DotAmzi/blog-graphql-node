module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.addColumn('posts', 'id_user', {
      type: Sequelize.INTEGER(11),
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    });
  },

  down: function(queryInterface, Sequelize) {
    return queryInterface.removeColumn('posts', 'id_user');
  }
};