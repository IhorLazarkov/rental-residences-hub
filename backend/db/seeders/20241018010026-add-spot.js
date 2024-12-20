'use strict';

const options = { tableName: "Spots" };
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

const { User, Spot } = require('../models')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    const spots = [{
      address: '111 Main St',
      city: "Atlanta",
      state: 'GA',
      country: "US",
      lat: 10.01,
      lng: 23.1,
      name: 'Appartment',
      description: "Comfortable 1br appertments in downtown",
      price: 140.00,
    },
    {
      address: "5500 Park St",
      city: "Ashland City",
      state: "TN",
      country: "US",
      lat: 10.01,
      lng: 23.1,
      name: "House",
      description: "Comfortable 1br house for family",
      price: 800.00,
    },
    {
      address: "250 Broadway",
      city: "Ashland",
      state: "NC",
      country: "US",
      lat: 10.01,
      lng: 23.1,
      name: "Appartment",
      description: "Comfortable 1br appertments in downtown",
      price: 250.00,
    },
    ];
    const user = await User.findOne({
      where: { username: "Demo-lition" }
    });
    spots.map(async spot => {
      const newSpot = await Spot.create(spot);
      await user.addSpot(newSpot)
    })
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete(options, null, {});
  }
};
