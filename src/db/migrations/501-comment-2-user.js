module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.addColumn('comments', 'id_user', {
      type: Sequelize.INTEGER(11),
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    });
  },

  down: function(queryInterface, Sequelize) {
    return queryInterface.removeColumn('comments', 'id_user');
  }
};