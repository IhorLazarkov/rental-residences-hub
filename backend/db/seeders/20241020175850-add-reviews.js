'use strict';

const { User, Spot, Review } = require('../models')

const options = { tableName: "Reviews" };
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

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

    //Get all spots with User
    const spots = await Spot.findAll({
      include: [{ model: User, required: true }]
    });

    //Define reviews
    const reviews = [
      {
        review: "This is wanderful appatment. I'll return here next time.",
        stars: 5,
      },
      {
        review: "Not bad but I've seen better.",
        stars: 3,
      }
    ];

    //Creare reviews for each spot
    spots.forEach(async spot => {
      reviews.map(async review => {
        review.spotId = spot.id;
        review.userId = spot.User.id;
        return await Review.create(review)
      });
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete(options, null, {})
  }
};
