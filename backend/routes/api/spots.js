const express = require('express');
const router = express.Router()

const { check, query } = require('express-validator');
const { handleValidationErrors, validateReview } = require('../../utils/validation');

const { User, Spot, Review, SpotImage, ReviewImage, sequelize, Sequelize } = require('../../db/models');
const { requireAuthorization, requireAuth, requireNotOwnerAuthorization } = require('../../utils/auth');
const { Op } = Sequelize;

const validateSpot = [
    check('address')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Please provide address'),
    check('city')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Please provide city'),
    check('state')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Please provide state'),
    check('country')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Please provide country'),
    check('lat')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Please provide lat'),
    check('lng')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Please provide lng'),
    check('name')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Please provide name'),
    check('description')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Please provide description'),
    check('price')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Please provide price'),
    handleValidationErrors
]

const queryParametersValidation = [
    query('page').optional().notEmpty().isInt().withMessage("Please provide correct numberic not empty page"),
    query('size').optional().notEmpty().isInt().withMessage("Please provide correct numberic not empty size"),
    query('minLat').optional().notEmpty().isInt().withMessage("Please provide correct numberic not empty minLat"),
    query('maxLat').optional().notEmpty().isInt().withMessage("Please provide correct numberic not empty maxLat"),
    query('minLng').optional().notEmpty().isInt().withMessage("Please provide correct numberic not empty minLng"),
    query('maxLng').optional().notEmpty().isInt().withMessage("Please provide correct numberic not empty maxLng"),
    query('minPrice').optional().notEmpty().isInt().withMessage("Please provide correct numberic not empty minPrice"),
    query('maxPrice').optional().notEmpty().isInt().withMessage("Please provide correct numberic not empty maxPrice"),
    handleValidationErrors
];

router.get('/:spotId/bookings', requireAuth, requireAuthorization, async (req, res, next) => {
    const { spotId } = req.params;

    try {
        // Fetch bookings for the spot 
        const bookings = await Booking.findAll({
            where: { spotId },
            include: [{ model: User, attributes: ['id', 'firstName', 'lastName'] }],
        });

        // Prepare the response with full booking details
        const response = {
            Bookings: bookings.map(booking => ({
                id: booking.id,
                spotId: booking.spotId,
                userId: booking.userId,
                startDate: booking.startDate,
                endDate: booking.endDate,
                createdAt: booking.createdAt,
                updatedAt: booking.updatedAt,
                User: {
                    id: booking.User.id,
                    firstName: booking.User.firstName,
                    lastName: booking.User.lastName,
                },
            })),
        };

        return res.status(200).json(response);
    } catch (error) {
        next(error);
    }
});

router.post('/:spotId/bookings', requireAuth, requireNotOwnerAuthorization, async (req, res, next) => {
    const { spotId } = req.params;
    const userId = req.user.id;
    const { startDate, endDate } = req.body;

    const t = await sequelize.transaction();

    try {
        const spot = await Spot.findByPk(spotId);
        if (!spot) {
            return res.status(404).json({ message: "Spot couldn't be found" });
        }
        // Validate date inputs
        const today = new Date();
        const start = new Date(startDate);
        const end = new Date(endDate);

        if (start < today) {
            await t.rollback();
            return res.status(400).json({
                message: "Bad Request",
                errors: { startDate: "startDate cannot be in the past" },
            });
        }
        if (end <= start) {
            await t.rollback();
            return res.status(400).json({
                message: "Bad Request",
                errors: { endDate: "endDate cannot be on or before startDate" },
            });
        }

        // Check for booking conflicts
        const existingBookings = await Booking.findAll({
            where: {
                spotId,
                [Op.or]: [
                    { startDate: { [Op.between]: [startDate, endDate] } },
                    { endDate: { [Op.between]: [startDate, endDate] } },
                    { startDate: { [Op.lte]: startDate }, endDate: { [Op.gte]: endDate } },
                ],
            },
            transaction: t,
        });

        if (existingBookings.length > 0) {
            await t.rollback();
            return res.status(403).json({
                message: "Sorry, this spot is already booked for the specified dates",
                errors: {
                    startDate: "Start date conflicts with an existing booking",
                    endDate: "End date conflicts with an existing booking",
                },
            });
        }

        // Create new booking
        const newBooking = await Booking.create(
            {
                spotId,
                userId,
                startDate,
                endDate,
            },
            { transaction: t }
        );

        // Commit the transaction
        await t.commit();

        // Send the response
        return res.status(201).json(newBooking);
    } catch (error) {
        // Rollback the transaction in case of an error
        await t.rollback();
        next(error);
    }
});
//create a spot
router.post('/',
    requireAuth,
    validateSpot,
    async (req, res, next) => {

        //Create a transaction
        const t = await sequelize.transaction();

        try {
            const { id } = req.user
            const {
                address,
                city,
                state,
                country,
                lat, lng,
                name,
                description,
                price
            } = req.body

            const spot = Spot.build({
                address,
                city,
                state,
                country,
                lat, lng,
                name,
                description,
                price
            });

            const user = await User.findByPk(id);
            await spot.save();
            await user.addSpot(spot);

            //COMMIT
            await t.commit();

            const newSpot = await Spot.findByPk(spot.id, {
                attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'description', 'price', 'createdAt', 'updatedAt']
            })

            return res.status(201).json(newSpot);

        } catch (error) {
            //ROLLBACK
            await t.rollback();

            next(error)
        }
    });
//New image for spot based on Spot's id
router.post('/:spotId/images', requireAuth, requireAuthorization, async (req, res, next) => {
    const { spotId } = req.params;
    const { url, preview } = req.body;
    try {
        const newImage = await SpotImage.create({
            spotId,
            url,
            preview,
        });

        return res.status(201).json({
            id: newImage.id,
            url: newImage.url,
            preview: newImage.preview
        });
    } catch (error) {
        next(error);
    }
})
//New review
router.post('/:spotId/reviews',
    requireAuth,
    validateReview,
    async (req, res, next) => {
        try {

            const { spotId } = req.params;
            const { id: userId } = req.user;

            //Check if spot exist
            const spot = await Spot.findByPk(spotId)
            if (!spot) {
                const error = new Error("Spot couldn't be found")
                error.title = "Spot couldn't be found"
                error.status = 404
                error.errors = { message: "Spot couldn't be found" }
                return next(error)
            }

            //Check if review exist
            const isReviewExist = await Review.findOne({ where: { spotId, userId } })
            if (isReviewExist) {
                const error = new Error("User already has a review for this spot")
                error.status = 500
                error.title = "User already has a review for this spot"
                error.errors = { message: "User already has a review for this spot" }
                return next(error)
            }

            //Add new review
            const newReview = await Review.create({ ...req.body, userId, spotId });
            const review = await Review.findByPk(newReview.id, {
                attributes: [
                    'id', 'userId', 'spotId', 'review', 'stars', 'createdAt', 'updatedAt']
            })
            return res.status(201).json(review);

        } catch (error) {
            const err = new Error("Failed to create review")
            err.status = 500
            err.title = "Failed to create review"
            err.errors = { message: error.message }
            next(err)
        }
    });

router.put('/:spotId',
    requireAuth,
    validateSpot,
    requireAuthorization,
    async (req, res, next) => {
        try {
            const id = req.params.spotId;
            const spot = await Spot.findByPk(id);
            if (!spot) {
                const error = new Error("Not found")
                error.status = 404;
                error.title = "Not found";
                error.errors = { message: "Record not found" };
                return next(error);
            }
            await Spot.update(req.body, {
                where: { id }
            })
            const updateSpot = await Spot.findByPk(id, {
                attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'description', 'price', 'createdAt', 'updatedAt']
            })
            return res.json(updateSpot)
        } catch (error) {
            next(error)
        }
    });

router.delete('/:spotId',
    requireAuth,
    requireAuthorization,
    async (req, res, next) => {
        try {

            const { spotId } = req.params
            if (!spotId) {
                const error = new Error("Bad request")
                error.title = "Bad request"
                error.status = 400;
                error.errors = { message: "Bad request" }
                return next(error)
            }

            const spot = await Spot.findByPk(spotId)
            if (!spot) {
                const error = new Error("Not found")
                error.title = "Not found"
                error.status = 404;
                error.errors = { message: "Not found" }
                return next(error);
            }

            await spot.destroy()
            return res.json({ message: "Successfully deleted" })

        } catch (error) {
            const err = new Error("Failed to delete spot")
            err.title = "Failed to delete spot"
            err.status = 500
            err.errors = { message: error.message }
            next(err)
        }
    });
router.get('/:spotId/reviews', async (req, res, next) => {
    const { spotId } = req.params;

    try {

        const spot = await Spot.findByPk(spotId, {
            include: [
                { model: SpotImage, attributes: ['id', 'url', 'preview'] },
                { model: User, attributes: ['id', 'firstname', 'lastname'] }
            ]
        });


        if (!spot) {
            return res.status(404).json({
                message: "Spot couldn't be found"
            });
        }


        const reviews = await Review.findAll({
            where: { spotId: spot.id },
            include: [
                { model: User, attributes: ['id', 'firstname', 'lastname'] },
                { model: ReviewImage, attributes: ['id', 'url'] }
            ]
        });


        const numReviews = reviews.length;
        const avgStarRating = reviews.reduce((sum, review) => sum + review.stars, 0) / (numReviews || 1);


        const spotDetails = {
            id: spot.id,
            ownerId: spot.ownerId,
            address: spot.address,
            city: spot.city,
            state: spot.state,
            country: spot.country,
            lat: parseFloat(spot.lat),
            lng: parseFloat(spot.lng),
            name: spot.name,
            description: spot.description,
            price: parseFloat(spot.price),
            createdAt: spot.createdAt,
            updatedAt: spot.updatedAt,
            numReviews: numReviews,
            avgStarRating: parseFloat(avgStarRating).toFixed(1),
            SpotImages: spot.SpotImages,
            Owner: {
                id: spot.User.id,
                firstName: spot.User.firstname,
                lastName: spot.User.lastname
            },
            Reviews: reviews.map(review => ({
                id: review.id,
                userId: review.userId,
                spotId: review.spotId,
                review: review.review,
                stars: review.stars,
                createdAt: review.createdAt,
                updatedAt: review.updatedAt,
                User: {
                    id: review.User.id,
                    firstName: review.User.firstname,
                    lastName: review.User.lastname
                },
                ReviewImages: review.ReviewImages
            }))
        };


        return res.status(200).json(spotDetails);
    } catch (error) {
        next(error);
    }
});
router.get('/current',
    requireAuth,
    async (req, res, next) => {
        try {
            const { id } = req.user
            const spots = await Spot.findAll({
                where: { ownerId: id },
                include: [
                    {
                        model: Review,
                        attributes: []
                    },
                    {
                        model: SpotImage,
                        attributes: []
                    }
                ],
                attributes: {
                    include: [
                        [Sequelize.fn('avg', Sequelize.col('Reviews.stars')), 'avgRating'],
                        [Sequelize.col('SpotImages.preview'), 'previewImage']
                    ]
                },
                group: ['Spot.id','SpotImages.preview'],
            });

            return res.json({ Spots: spots })

        } catch (error) {
            const err = new Error("Failed to get data");
            err.title = "Failed to get data"
            err.status = 500
            err.errors = { message: error.message }
            next(err)
        }
    });

router.get('/:spotId', async (req, res) => {
    const { spotId } = req.params;

    const spot = await Spot.findByPk(spotId, {
        include: [
            {
                model: SpotImage,
                attributes: ['id', 'url', 'preview']
            },
            {
                model: User,
                attributes: ['id', 'firstname', 'lastname']
            }
        ]
    });
    if (!spot) {
        return res.status(404).json({
            message: "Spot couldn't be found"
        });
    }
    const reviews = await Review.findAll({
        where: { spotId: spot.id },
        attributes: [
            [sequelize.fn('COUNT', sequelize.col('id')), 'numReviews'], // Count reviews
            [sequelize.fn('AVG', sequelize.col('stars')), 'avgStarRating'] // Average rating
        ]
    });
    const numReviews = parseInt(reviews[0].dataValues.numReviews) || 0;
    const avgStarRating = parseFloat(reviews[0].dataValues.avgStarRating).toFixed(1) || null;

    const spotDetails = {
        id: spot.id,
        ownerId: spot.ownerId,
        address: spot.address,
        city: spot.city,
        state: spot.state,
        country: spot.country,
        lat: parseFloat(spot.lat),
        lng: parseFloat(spot.lng),
        name: spot.name,
        description: spot.description,
        price: parseFloat(spot.price),
        createdAt: spot.createdAt,
        updatedAt: spot.updatedAt,
        numReviews: numReviews,
        avgStarRating: avgStarRating,
        SpotImages: spot.SpotImages,
        Owner: {
            id: spot.User.id,
            firstName: spot.User.firstname,
            lastName: spot.User.lastname
        }
    };

    return res.status(200).json(spotDetails);
});

router.get('/', queryParametersValidation, async (req, res, next) => {
    try {
        const where = {};
        //retrive filters criterias
        let { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query
        //validate filters
        page = parseInt(page)
        size = parseInt(size)
        if (Number.isNaN(page)) page = 1
        if (Number.isNaN(size)) size = 20
        if (minLat) {
            minLat = parseFloat(minLat)
            if (!Number.isNaN(minLat))
                where.lat = { [Op.gte]: minLat }
        }
        if (maxLat) {
            minLat = parseFloat(maxLat)
            if (!Number.isNaN(maxLat))
                where.lat = { [Op.lte]: maxLat }
        }
        if (minLng) {
            minLng = parseFloat(minLng)
            if (!Number.isNaN(minLng))
                where.lng = { [Op.gte]: minLng }
        }
        if (maxLng) {
            maxLat = parseFloat(maxLng)
            if (!Number.isNaN(maxLng))
                where.lng = { [Op.lte]: maxLng }
        }
        if (minPrice) {
            minPrice = parseFloat(minPrice)
            if (!Number.isNaN(minPrice))
                where.price = { [Op.gte]: minPrice }
        }
        if (maxPrice) {
            maxPrice = parseFloat(maxPrice)
            if (!Number.isNaN(maxPrice))
                where.price = { [Op.lte]: maxPrice }
        }

        const spots = await Spot.findAll({
            where,
            include: [
                {
                    model: SpotImage,
                    attributes: ['url'],
                    where: { preview: true },
                    required: false
                },
                {
                    model: Review,
                    attributes: ['stars']
                }
            ],
            //When this line is on then "SQLITE_ERROR: no such column: SpotImages.url"
            // group: ['Spot.id', 'SpotImages.url'],
            group: ['Spot.id'],
            limit: size,
            offset: size * (page - 1),
        });
        // console.log('spots :>> ', spots[0].Reviews);
        if (spots.length === 0) {
            return res.status(200).json({ Spots: [], page, size }); // Return empty array
        }
        const formattedSpots = spots.map(spot => {
            let previewImage = null;

            if (spot.SpotImages && spot.SpotImages.length > 0) {
                previewImage = spot.SpotImages[0].url;
            }

            //calculate average
            let avgRating = 0;
            const ratings = spot.Reviews
            if (ratings && ratings.length > 0) {
                avgRating =
                    ratings.map(review => parseFloat(review.stars))
                        .reduce((acc, cur) => acc + cur) / ratings.length;
            }

            return {
                id: spot.id,
                ownerId: spot.ownerId,
                address: spot.address,
                city: spot.city,
                state: spot.state,
                country: spot.country,
                lat: parseFloat(spot.lat),
                lng: parseFloat(spot.lng),
                name: spot.name,
                description: spot.description,
                price: parseFloat(spot.price),
                createdAt: spot.createdAt,
                updatedAt: spot.updatedAt,
                avgRating: avgRating,
                previewImage: previewImage
            };
        });

        return res.status(200).json({ Spots: formattedSpots, page: page, size: size });
    } catch (err) {
        const error = new Error("Failed to get data")
        error.status = 500
        error.title = "Failed to get data"
        error.errors = ({ error: err.message });
        next(error)
    }
});


module.exports = router
