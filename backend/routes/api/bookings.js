const express = require('express');
const router = express.Router()

const { Spot, SpotImage, Booking } = require('../../db/models');
const {  requireAuth, } = require('../../utils/auth');

router.get('/current', requireAuth, async (req, res, next) => {
    const userId = req.user.id;

    try {
        const bookings = await Booking.findAll({
            where: { userId },
            include: [
                {
                    model: Spot,
                    attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price'],
                    include: [
                        {
                            model: SpotImage,
                            attributes: ['url'],
                            where: { preview: true },
                            required: false,
                        }
                    ]
                }
            ]
        });

        if (bookings.length === 0) {
            return res.status(200).json({ Bookings: [] });
        }

        const formatBookings = bookings.map(booking => {
            const spot = booking.Spot;
            let previewImage = spot.SpotImages?.[0]?.url || null;

            return {
                id: booking.id,
                spotId: booking.spotId,
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
                    previewImage,
                },
                userId: booking.userId,
                startDate: booking.startDate,
                endDate: booking.endDate,
                createdAt: booking.createdAt,
                updatedAt: booking.updatedAt,
            };
        });

        return res.status(200).json({ Bookings: formatBookings });
    } catch (error) {
        next(error);
    }
});

router.put('/:bookingId', requireAuth, async (req, res, next) => {
    const { bookingId } = req.params;
    const userId = req.user.id;
    const { startDate, endDate } = req.body;

    // Start a transaction
    const t = await sequelize.transaction();

    try {
        // Find the booking
        const booking = await Booking.findByPk(bookingId, {
            include: { model: Spot }, // Include associated spot for conflict checks
            transaction: t,
        });

        if (!booking) {
            await t.rollback();
            return res.status(404).json({ message: "Booking couldn't be found" });
        }

        // Ensure booking belongs to the current user
        if (booking.userId !== userId) {
            await t.rollback();
            return res.status(403).json({ message: "You are not authorized to edit this booking" });
        }

        // Prevent editing bookings that are past the end date
        const today = new Date();
        if (new Date(booking.endDate) < today) {
            await t.rollback();
            return res.status(403).json({ message: "Past bookings can't be modified" });
        }

        // Validate date inputs
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
        const conflicts = await Booking.findAll({
            where: {
                spotId: booking.spotId,
                id: { [Op.ne]: bookingId }, // Exclude the current booking
                [Op.or]: [
                    { startDate: { [Op.between]: [startDate, endDate] } },
                    { endDate: { [Op.between]: [startDate, endDate] } },
                    { startDate: { [Op.lte]: startDate }, endDate: { [Op.gte]: endDate } },
                ],
            },
            transaction: t,
        });

        if (conflicts.length > 0) {
            await t.rollback();
            return res.status(403).json({
                message: "Sorry, this spot is already booked for the specified dates",
                errors: {
                    startDate: "Start date conflicts with an existing booking",
                    endDate: "End date conflicts with an existing booking",
                },
            });
        }

        // Update the booking
        booking.startDate = startDate;
        booking.endDate = endDate;
        await booking.save({ transaction: t });

        // Commit the transaction
        await t.commit();

        // Send the updated booking details
        return res.status(200).json({
            id: booking.id,
            spotId: booking.spotId,
            userId: booking.userId,
            startDate: booking.startDate,
            endDate: booking.endDate,
            createdAt: booking.createdAt,
            updatedAt: booking.updatedAt,
        });
    } catch (error) {
        // Rollback the transaction in case of an error
        await t.rollback();
        next(error);
    }
});

router.delete('/:bookingId', requireAuth, async (req, res, next) => {
    const { bookingId } = req.params;
    const userId = req.user.id;

    try {
        // Find the booking and associated spot
        const booking = await Booking.findByPk(bookingId, {
            include: { model: Spot },
        });

        if (!booking) {
            return res.status(404).json({ message: "Booking couldn't be found" });
        }

        const spotOwnerId = booking.Spot.ownerId;

        // Check for authorization: User must own the booking or the spot
        if (booking.userId !== userId && spotOwnerId !== userId) {
            return res.status(403).json({
                message: "You are not authorized to delete this booking",
            });
        }

        // Prevent deletion of bookings that have already started
        const today = new Date();
        if (new Date(booking.startDate) <= today) {
            return res.status(403).json({
                message: "Bookings that have been started can't be deleted",
            });
        }

        // Delete the booking
        await booking.destroy();

        // Respond with success
        return res.status(200).json({ message: "Successfully deleted" });
    } catch (error) {
        next(error);
    }
});


module.exports = router;