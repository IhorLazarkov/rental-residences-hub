const express = require('express');
const { ReviewImage, Review } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const router = express.Router();

//Delete a Review Image
router.delete("/:imageId", requireAuth, async (req, res) => {
    const { id } = req.user;
    const { imageId } = req.params;

    const imageWithReview = await ReviewImage.findOne({
        where: { id: imageId },
        include: { model: Review }
    });

    const imageToDelete = await ReviewImage.findByPk(imageId);
    if (imageToDelete) {
        if (id === imageWithReview.Review.userId) {
            await imageToDelete.destroy();
            res.json({
                "message": "Successfully deleted"
            });

        } else {
            res.status(403);
            res.json({
                "message": "Forbidden"
            });
        }

    } else {
        res.status(404);
        res.json({
            "message": "Review Image couldn't be found"
        });
    }

});
module.exports = router
