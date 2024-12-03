'use strict';

const { User, Spot, Booking } = require('../models')

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

    const user = await User.findOne({
      where: {
        username: "FakeUser1"
      }
    });
    const spot = await Spot.findOne({
      where: {
        city: "Atlanta",
        state: "GA"
      }
    });
    const booking = await Booking.create({
      startDate: new Date(Date.now()),
      endDate: new Date(Date.now()),
      userId: user.id,
      spotId: spot.id
    });
    await user.addBooking(booking);
    await spot.addBooking(booking);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    const user = await User.findOne({
      attributes: ['id'],
      where: { username: "FakeUser1" }
    });
    await Booking.destroy({
      where: { userId: user.id }
    })
  }
};
