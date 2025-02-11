const express = require('express');
const router = express.Router();

const { Tracking } = require('../../db/models');

const tracking = async (req, _res, next) => {
    try {
        await Tracking.create({ token: req.csrfToken(), url: req.url });
        next()
    } catch (error) {
        next(error);
    }
};

router.get('/', async (_req, res, next) => {
    try {
        const result = await Tracking.findAll();
        res.json({ result });
    } catch (error) {
        next(error)
    }
});

module.exports = { tracking, trackingRouter: router };