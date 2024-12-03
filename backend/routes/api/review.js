const express = require('express');
const router = express.Router()

const { check } = require('express-validator');
const { handleValidationErrors, validateReview } = require('../../utils/validation');

const { User, Spot, Review, SpotImage, ReviewImage } = require('../../db/models');
const { requireAuthorization, requireReviewAuthorization, requireAuth } = require('../../utils/auth');

router.post('/:reviewId/images',
    requireAuth,
    requireReviewAuthorization,
    async (req, res, next) => {
      const { reviewId } = req.params;
      const { url } = req.body;

      try {
        const imageCount = await ReviewImage.count({ where: { reviewId } });
        if (imageCount >= 10) {
          return res.status(403).json({
            message: "Maximum number of images for this resource was reached"
          });
        }
        const newImage = await ReviewImage.create({
          reviewId,
          url
        });

        return res.status(201).json({
          id: newImage.id,
          url: newImage.url
        });

      } catch (error) {
        next(error);
      }
  });

router.put('/:reviewId',
    requireAuth,
    requireReviewAuthorization,
    validateReview,
    async (req, res, next) => {
        try {
            const { reviewId } = req.params
            await Review.update(req.body, {
                where: { id: reviewId }
            });
            const review = await Review.findByPk(reviewId, {
                attributes: [
                    'id', 'userId', 'spotId', 'review', 'stars', 'createdAt', 'updatedAt'
                ]
            })
            res.json(review)
        } catch (error) {
            const err = new Error("Failed to edit review")
            err.status = 500
            err.title = "Failed to edit review"
            err.errors = { message: error.message }
            next(err)
        }
    });

router.delete('/:reviewId',
    requireAuth,
    requireReviewAuthorization,
    async (req, res, next) => {

        try {
            const { reviewId } = req.params
            const review = await Review.findByPk(reviewId)
            await review.destroy()
            return res.json({ message: "Successfully deleted" })

        } catch (error) {
            const err = new Error("Failed to delete")
            err.status = 500
            err.title = "Failed to delete"
            err.errors = { message: error.message }
            return next(err)
        }
    });
router.get('/current', requireAuth, async (req, res, next) => {
    try {
        const userId = req.user.id;

        const reviews = await Review.findAll({
            where: { userId },
            include: [
                {
                    model: User,
                    attributes: ['id', ['firstname','firstName'], ['lastname','lastName']]
                },
                {
                    model: Spot,
                    attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price'],
                    include: [
                        {
                            model: SpotImage,
                            attributes: ['url'],
                            where: { preview: true },
                            required: false
                        }
                    ]
                },
                {
                    model: ReviewImage,
                    attributes: ['id', 'url']
                }
            ]
        });
        const formatReviews = reviews.map(review => {
            const spot = review.Spot;
            const previewImage = spot.SpotImages.length ? spot.SpotImages[0].url : null;
            //const ReviewImage = review.ReviewImages.length ? review.ReviewImages : [{ id: null, url: 'https://via.placeholder.com/150' }];

            return {
                id: review.id,
                userId: review.userId,
                spotId: review.spotId,
                review: review.review,
                stars: review.stars,
                createdAt: review.createdAt,
                updatedAt: review.updatedAt,
                User: review.User,
                Spot: {
                    id: spot.id,
                    ownerId: spot.ownerId,
                    address: spot.address,
                    city: spot.city,
                    state: spot.state,
                    country: spot.country,
                    lat: spot.lat,
                    lng: spot.lng,
                    name: spot.name,
                    price: spot.price,
                    previewImage
                },
                ReviewImages: review.ReviewImages
            };
        });
        return res.status(200).json({ Reviews: formatReviews });
    } catch (error) {
        next(error);
    }
})
module.exports = router
