'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('tags', [{
      name: 'Front-End'
    },
    {
      name: 'Back-End'
    },
    {
      name: 'Database'
    },
    {
      name: 'Mobile'
    }], {});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('tags', null, [{
      name: 'Front-End'
    },
    {
      name: 'Back-End'
    },
    {
      name: 'Database'
    },
    {
      name: 'Mobile'
    }]);
  }
};