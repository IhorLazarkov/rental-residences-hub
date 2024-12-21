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
    {
      address: "2975 Arabian Nights Boulevard",
      city: "Orlando",
      state: "FL",
      country: "US",
      lat: 10.01,
      lng: 23.1,
      name: "Resort",
      description: "Located within 4 mi of the Walt Disney World Resort, this Orlando resort features 7 heated outdoor pools and 6 hot tubs. Suites have a fully equipped kitchen or kitchenette. Aquatica, SeaWorld’s water park, is 9.9 mi away.",
      price: 150.00,
    },
    {
      address: "8738 International Drive, Orlando",
      city: "Orlando",
      state: "FL",
      country: "US",
      lat: 10.01,
      lng: 23.1,
      name: "Resort",
      description: "Located in Orlando, Florida, the Avanti Resort features an outdoor swimming pool, a poolside bar and grill, and a barista.",
      price: 150.00,
    },
    ];
    const users = await User.findAll();
    for (let i = 0, j = 0; i < spots.length; i++, j++) {
      if (j >= users.length) j = 0
      const spot = spots[i]
      const user = users[j]

      const newSpot = await Spot.create(spot)
      await user.addSpot(newSpot)
    }
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
