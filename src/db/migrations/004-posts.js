
module.exports = {
    up: (queryInterface, Sequelize) => {
      return queryInterface.createTable('posts', {
        id: {
          type: Sequelize.INTEGER(11),
          allowNull: false,
          primaryKey: true,
          autoIncrement: true
        },
        title: {
          type: Sequelize.STRING(200),
          allowNull: false
        },
        text: {
          type: Sequelize.TEXT,
          allowNull: false
        },
        photo: {
          type: Sequelize.STRING(250),
          allowNull: true
        }
      });
    },
  
    down: (queryInterface, Sequelize) => {
      return queryInterface.dropTable('posts', null, {});
    }
  };