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
    const imageStorage = [
      {
        key: 'Appartment',
        preview: 'https://images1.apartments.com/i2/xmEq714mVJxoobkXUt7dW2M_9Rh_4tEfHs9hBeu9gjQ/112/banner-at-westfield-gallatin-tn-primary-photo.jpg?p=1',
        urls: [
          "https://images1.apartments.com/i2/R2WTEdcLOxE_U6rTu2dKShINPcNmLwuhYH0ApY95VK8/112/chandler-park-gallatin-gallatin-tn-primary-photo.jpg?p=1",
          'https://images1.apartments.com/i2/yXKVnziVfga2MMhiM0uN7GIOOq_1cCI_tmalC3xKjaA/112/chandler-park-gallatin-gallatin-tn-2br-2ba---1241-sf.jpg?p=1',
          'https://images1.apartments.com/i2/ScXQWm5-3wPhBgam3fm13othSDagdzhrSc7pI_RWY0E/112/chandler-park-gallatin-gallatin-tn-2br-2ba---1241-sf.jpg?p=1',
          'https://images1.apartments.com/i2/UYo4ETXO4UQ0cpdB1n2sT_L-FTtijxKjx-GZC2YS6EY/112/chandler-park-gallatin-gallatin-tn-2br-2ba---1241-sf.jpg?p=1'
        ]
      },
      {
        key: 'Appartment',
        preview: 'https://images1.apartments.com/i2/xmEq714mVJxoobkXUt7dW2M_9Rh_4tEfHs9hBeu9gjQ/112/banner-at-westfield-gallatin-tn-primary-photo.jpg?p=1',
        urls: [
          'https://images1.apartments.com/i2/Vm-ecgQQpYgdWO-sxW9buxe60ifR4EVUlKdhEK8ypBg/112/banner-at-westfield-gallatin-tn-building-photo.jpg?p=1',
          'https://images1.apartments.com/i2/Cg88IA64A5dL5IMk-EF4HTjpxaFiUP0RKiWK_2gpwgM/112/banner-at-westfield-gallatin-tn-building-photo.jpg?p=1',
          'https://images1.apartments.com/i2/_bp1oMb1FLiGp4X1-dkVDwMfmOtGIL5N6MPFDreRZeI/112/banner-at-westfield-gallatin-tn-building-photo.jpg?p=1',
          'https://images1.apartments.com/i2/wAehYwY7s-AFuf7iAEWEA_ARkulW3kQBr7J0aWYRsac/112/banner-at-westfield-gallatin-tn-building-photo.jpg?p=1'
        ]
      },
      {
        key: "House",
        preview: 'https://a0.muscache.com/im/ml/photo_enhancement/pictures/73af5749-a5fa-423c-be54-78496a77c06a.jpg?im_w=960&im_format=avif',
        urls: [
          'https://a0.muscache.com/im/pictures/0218acef-d0c9-44f6-a625-710f45cbc972.jpg?im_w=480&im_format=avif',
          'https://a0.muscache.com/im/ml/photo_enhancement/pictures/d3f3db82-066c-4875-aac5-ec08557f84f1.jpg?im_w=480&im_format=avif',
          'https://a0.muscache.com/im/pictures/4c98945e-63c3-46b7-ae64-eb20f665bb23.jpg?im_w=320&im_format=avif',
          'https://a0.muscache.com/im/pictures/285abf2e-2f48-4164-bda6-dfe3e2564a8b.jpg?im_w=320&im_format=avif'
        ]
      }];

    Array.from(["Appartment", "House"]).forEach(async type => {

      const images = imageStorage.filter(store => store.key === type)

      const spots = await Spot.findAll({ where: { name: type } });

      for (let i = 0; i < spots.length; i++) {
        //exit when there are no images
        if (i >= images.length) break;
        //create preivew image
        const { id: spotId } = spots[i];
        const { preview: url, urls } = images[i];
        await SpotImage.create({ preview: true, url, spotId });
        //create other images
        urls.forEach(async url => {
          await SpotImage.create({ spotId, preview: false, url });
        })
      }
    });
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
