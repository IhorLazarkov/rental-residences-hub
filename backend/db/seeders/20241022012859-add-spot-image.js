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
        preview: 'https://images1.apartments.com/i2/bQdDSRxHzkxNhSco4Jyz-Seu0bavFaF48SdfHCU9tZs/112/statler-mccains-station-gallatin-tn-primary-photo.jpg?p=1',
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
      },
      {
        key: "Resort",
        preview: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/150069558.jpg?k=db2886047e6dfb65e62ad97d804ab8cb4394e88915ce8bd618e7ab61a4d92253&o=',
        urls: [
          'https://cf.bstatic.com/xdata/images/hotel/max500/162015939.jpg?k=51a5ab3d80a151b18e476d2971f75bf48eee1c9b556e5457bb1c04bb53664fbd&o=',
          'https://cf.bstatic.com/xdata/images/hotel/max500/162015645.jpg?k=d9658627dcbc50b8e814f4280d7614e96e857ca0cc84b2b3fa42bf3f142d1be4&o=',
          'https://cf.bstatic.com/xdata/images/hotel/max1024x768/492313268.jpg?k=28fc5561cb307eddb91ccb69f9885aa0376e17e9ec2c11e1ece63d254c307d3c&o=&hp=1',
          'https://cf.bstatic.com/xdata/images/hotel/max1024x768/130428633.jpg?k=77358d5524cf12dfb53cfbdd9a7aafa1310cf84ba13a1a45a757fefeda8aeb25&o=&hp=1'
        ]
      },
      {
        key: "Resort",
        preview: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/450459083.jpg?k=fae713466385b3383c39600b205e7d4bf061a54ba827661b7d8800aa25bb178e&o=&hp=1',
        urls: [
          'https://cf.bstatic.com/xdata/images/hotel/max1024x768/530808130.jpg?k=1cdcb579b9f8f0bc4e1f5b8a2f0763ed74e5b930538c4f8f45bd140da7132b7c&o=&hp=1',
          'https://cf.bstatic.com/xdata/images/hotel/max1024x768/518056960.jpg?k=cbe6df8ad2a3328d6d38df99a984742c2f4f08c9f341b01d4a212e34203513ca&o=&hp=1',
          'https://cf.bstatic.com/xdata/images/hotel/max1024x768/430975220.jpg?k=1c13d9b1a8d33c03b5a72356a141d9bcc129a9494998cc511a376ab4ffd9e552&o=&hp=1',
          'https://cf.bstatic.com/xdata/images/hotel/max1024x768/527104661.jpg?k=24b015ccd9dcdceda04862e9b21792cc11b0c1b4f4472d8e82ab2117af4ef0d8&o=&hp=1'
        ]
      },
    ];

    Array.from(["Appartment", "House", "Resort"]).forEach(async type => {

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
          console.log({ spotId, preview: false, url });
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
