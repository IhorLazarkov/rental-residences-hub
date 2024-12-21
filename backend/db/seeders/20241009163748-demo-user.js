'use strict';

const options = { tableName: "Users" };
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
const { User } = require('../models');
const bcrypt = require("bcryptjs");

module.exports = {
  async up (queryInterface, Sequelize) {
    await User.bulkCreate([
      {
        email: 'demo@user.io',
        username: 'Demo-lition',
        firstname: "Firstname",
        lastname: "Lastname",
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        email: 'fake@user.io',
        username: 'Fakeuser1',
        firstname: "Firstname1",
        lastname: "Lastname1",
        hashedPassword: bcrypt.hashSync('password')
      }
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['Demo-lition', 'Fakeuser1'] }
    }, {});
  }
};
