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

    //Define reviews
    const store = [
      {
        type: "Appartment",
        review: "This is wanderful appatment. I'll return here next time.",
        stars: 5,
      },
      {
        type: "Appartment",
        review: "I really liked this appartment because of its close location to downtown. But, unfortunately, it was a bit loud and we couldn't sleep.",
        stars: 4
      },
      {
        type: "House",
        review: "We had great time even thought it was autom.",
        stars: 5,
      },
      {
        type: "House",
        review: "During our stay there was a brokage of water pipe. But, other then that all's good.",
        stars: 3
      }
    ];

    const users = await User.findAll({ where: { username: "FakeUser1" } })

    Array.from(["Appartment", "House"]).forEach(async type => {

      const reviews = store.filter(review => review.type === type);

      const spots = await Spot.findAll({ where: { name: type } });

      for (let i = 0; i < spots.length; i++) {
        const { id: spotId } = spots[i];
        reviews.forEach(async ({ review, stars }) => {
          await Review.create({
            userId: users[0].id,
            spotId,
            review,
            stars
          })
        })
      }
    })
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
