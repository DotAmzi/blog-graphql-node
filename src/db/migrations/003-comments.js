
module.exports = {
    up: (queryInterface, Sequelize) => {
      return queryInterface.createTable('comments', {
        id: {
          type: Sequelize.INTEGER(11),
          allowNull: false,
          primaryKey: true,
          autoIncrement: true
        },
        comment: {
          type: Sequelize.STRING(400),
          allowNull: false
        }
      });
    },
  
    down: (queryInterface, Sequelize) => {
      return queryInterface.dropTable('comments', null, {});
    }
  };