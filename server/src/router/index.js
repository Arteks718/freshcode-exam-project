const express = require('express');
const contestRouter = require('./contestRouter');
const userRouter = require('./userRouter');
const bankRouter = require('./bankRouter');
const offerRouter = require('./offerRouter');
const chatRouter = require('./chatRouter');

const router = express.Router();

router.use('/contests', contestRouter);
router.use('/user', userRouter);
router.use('/bank', bankRouter);
router.use('/offers', offerRouter)
router.use('/chat', chatRouter);

module.exports = router;
