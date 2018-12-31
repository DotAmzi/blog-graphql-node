
module.exports = {
    up: (queryInterface, Sequelize) => {
      return queryInterface.createTable('tags', {
        id: {
          type: Sequelize.INTEGER(11),
          allowNull: false,
          primaryKey: true,
          autoIncrement: true
        },
        name: {
          type: Sequelize.STRING(200),
          allowNull: false
        }
      });
    },
  
    down: (queryInterface, Sequelize) => {
      return queryInterface.dropTable('tags', null, {});
    }
  };