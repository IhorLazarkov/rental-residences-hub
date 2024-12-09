'use strict';

const { Spot, SpotImage } = require('../models')

const options = { tableName: 'SpotImages' }
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA
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
    const previewUrls = [
      "https://www.apartments.com/blog/sites/default/files/styles/x_large/public/image/2023-06/ParkLine-apartment-in-Miami-FL.jpg.webp?itok=lYDRCGzC",
      "https://images1.apartments.com/i2/o40ZE1DtHwHeKi88KPX0aCuumyFDoVBtYXrx-WWKJh4/116/icon-apartment-homes-at-hardin-valley-knoxville-tn-building-photo.jpg?p=1",
      "https://a0.muscache.com/im/pictures/73af5749-a5fa-423c-be54-78496a77c06a.jpg?im_w=960&im_format=avif",
      "https://a0.muscache.com/im/pictures/miso/Hosting-48913506/original/a84b972e-0c31-47ac-a6f5-c1d9b71d23ed.jpeg?im_w=960&im_format=avif",
      "https://a0.muscache.com/im/pictures/prohost-api/Hosting-1126836657626403052/original/8c03b8cc-d0f8-42cd-87ae-11fc76d284cb.jpeg?im_w=960&im_format=avif",
      "https://a0.muscache.com/im/pictures/miso/Hosting-1015173105201898287/original/35fbdbfb-60a4-45ca-bc42-e495e5ca840c.jpeg?im_w=960&im_format=avif",
      "https://a0.muscache.com/im/pictures/05ba13eb-12fb-40e6-bc79-4e572c6d5a51.jpg?im_w=960&im_format=avif",
      "https://a0.muscache.com/im/pictures/prohost-api/Hosting-1189105910526538058/original/85f13efc-b828-4d22-9553-504986f24c2b.jpeg?im_w=960&im_format=avif",
      "https://a0.muscache.com/im/pictures/prohost-api/Hosting-727079965119171863/original/ea1e07fb-a9d3-4b84-b89e-c647259444e8.jpeg?im_w=960&im_format=avif",
      "https://a0.muscache.com/im/pictures/prohost-api/Hosting-727079965119171863/original/4d760ef5-5252-4c9e-a9be-b8214b8c950e.jpeg?im_w=1200&im_format=avif",
      "https://a0.muscache.com/im/pictures/miso/Hosting-36767861/original/ffcc6215-0b1c-4e8c-b2e0-473b3c801014.jpeg?im_w=960&im_format=avif",
      "https://a0.muscache.com/im/pictures/miso/Hosting-49790674/original/56120f44-ec84-4925-af4a-184747e9b843.jpeg?im_w=960&im_format=avif",
      "https://a0.muscache.com/im/pictures/prohost-api/Hosting-1117311629040608738/original/e2370d6c-044a-403c-b187-7ff0f0c63557.jpeg?im_w=960&im_format=avif",
      "https://a0.muscache.com/im/pictures/hosting/Hosting-1047947025661441388/original/754b5876-3a32-404e-a134-83fc91497071.jpeg?im_w=960&im_format=avif",
      "https://a0.muscache.com/im/pictures/prohost-api/Hosting-49315894/original/4f523913-3270-44a0-9de8-698ba8c5cc1b.jpeg?im_w=720&im_format=avif",
      "https://a0.muscache.com/im/pictures/miso/Hosting-677422480583514492/original/f97adcf5-2742-4c96-98a9-4987ca4ec20c.jpeg?im_w=720&im_format=avif",
    ]
    const imgsUrls = [
      'https://images1.apartments.com/i2/KwFNdvxUUwvgF-1_5wNErZg4q4skPRJB-w4UC9GY6JQ/116/reserve-at-drakes-creek-hendersonville-tn-kitchen-with-hardwood-style-flooring-mod.jpg?p=1',
      "https://images1.apartments.com/i2/-NHSXcFaXKQR5ZAxrVkP2-jI9SC0GmKuUlo3ZVjB7sA/116/reserve-at-drakes-creek-hendersonville-tn-2br-15ba---950sf---living-room.jpg?p=1",
      'https://images1.apartments.com/i2/fx7C4CQwVWb4pamAYLU7UPOvz7-pv5YHZeuS6V5A_LA/116/reserve-at-drakes-creek-hendersonville-tn-spacious-living-room-with-hardwood-style.jpg?p=1',
      'https://images1.apartments.com/i2/qsAg5JCpseJQoBqLoVrKfu4f0R3xFZ51QGCaIz92KZw/116/reserve-at-drakes-creek-hendersonville-tn-2br-15ba---950sf---living-room.jpg?p=1',
    ]
    const spots = await Spot.findAll();
    spots.forEach(async (spot, i) => {

      //add preview image
      const image = await SpotImage.create({
        url: previewUrls[i],
        preview: true
      });
      await spot.addSpotImage(image);

      //add not preview images
      imgsUrls.forEach(async url => {
        const img = await SpotImage.create({
          url, preview: false
        });
        await spot.addSpotImage(img);
      })
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
