const express = require('express');
const router = express.Router();

const { Feedback } = require('../../db/models');

router.post('/', async (req, res, next) => {
    try {
        const { rating, message } = req.body
        await Feedback.create({ rating, message });
        res.status(201).json({ message: 'Thank you for your feedback!' });
    } catch (error) {
        const err = new Error("Failed to add feedback")
        err.title = "Failed to add feedback"
        err.status = 501
        err.errors = { message: error.message }
        next(err);
    }
});

module.exports = router;