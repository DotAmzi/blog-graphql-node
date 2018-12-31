module.exports = {
    up: function(queryInterface, Sequelize) {
      return queryInterface.addColumn('comments', 'id_post', {
        type: Sequelize.INTEGER(11),
        allowNull: true,
        references: {
          model: 'posts',
          key: 'id'
        }
      });
    },
  
    down: function(queryInterface, Sequelize) {
      return queryInterface.removeColumn('comments', 'id_post');
    }
  };