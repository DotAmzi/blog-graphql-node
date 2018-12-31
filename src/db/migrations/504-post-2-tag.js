module.exports = {
    up: function(queryInterface, Sequelize) {
      return queryInterface.addColumn('posts', 'id_tag', {
        type: Sequelize.INTEGER(11),
        allowNull: true,
        references: {
          model: 'tags',
          key: 'id'
        }
      });
    },
  
    down: function(queryInterface, Sequelize) {
      return queryInterface.removeColumn('posts', 'id_tag');
    }
  };