module.exports = {
    up: (queryInterface, Sequelize) => {
      return queryInterface.createTable('users', {
        id: {
          type: Sequelize.INTEGER(11),
          allowNull: false,
          primaryKey: true,
          autoIncrement: true
        },
        name: {
          type: Sequelize.STRING(200),
          allowNull: false
        },
        email: {
          type: Sequelize.STRING(250),
          allowNull: false
        },
        password: {
          type: Sequelize.STRING(100),
          allowNull: false
        },
        photo: {
          type: Sequelize.STRING(250),
          allowNull: true
        }
      });
    },
  
    down: (queryInterface, Sequelize) => {
      return queryInterface.dropTable('users', null, {});
    }
  };