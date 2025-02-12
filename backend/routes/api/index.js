
const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const spotsRouter = require('./spots.js');
const spotImagesRouter = require('./spotImage.js');
const reviewRouter = require('./review.js');
const reviewImagesRouter = require('./reviewimages.js');
const mapsRouter = require('./maps.js');
const { trackingRouter, tracking } = require('./tracking.js')
const feedback = require('./feedback.js')
const { restoreUser } = require("../../utils/auth.js");


// Connect restoreUser middleware to the API router
// If current user session is valid, set req.user to the user in the database
// If current user session is not valid, set req.user to null
router.use(restoreUser);
router.use(tracking);

router.use('/session', sessionRouter);

router.use('/users', usersRouter);

router.use('/spots', spotsRouter);

router.use('/reviews', reviewRouter);

router.use('/spot-images', spotImagesRouter);

router.use('/review-images', reviewImagesRouter);

router.use('/maps', mapsRouter);

router.use('/tracking', trackingRouter);

router.use('/feedback', feedback);

router.post('/test', (req, res) => {
  res.json({ requestBody: req.body });
});

module.exports = router;
