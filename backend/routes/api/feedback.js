const express = require('express');
const router = express.Router();

const { Feedback } = require('../../db/models');

router.post('/', async (req, res, next) => {
    try {
        const { rating, message } = req.body
        await Feedback.create({ rating, message });
        res.status(201).json({ message: 'Thank you for your feedback!' });
    } catch (err) {
        next(err)
    }
});

module.exports = router;