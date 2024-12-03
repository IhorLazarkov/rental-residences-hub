const express = require('express');
const router = express.Router();

const { requireAuth, requireSpotImageAuthorization } = require('../../utils/auth');
const { SpotImage } = require('../../db/models');

router.delete('/:imageId',
    requireAuth,
    requireSpotImageAuthorization,
    async (req, res, next) => {
        try {
            const { imageId } = req.params
            const spotImage = await SpotImage.findByPk(imageId)
            await spotImage.destroy()
            return res.json({ message: "Successfully deleted" });
        } catch (error) {
            const err = new Error("Falied to delete")
            err.status = 500
            err.title = "Failed to delete"
            err.errors = { message: err.message }
            next(err)
        }
    });

module.exports = router