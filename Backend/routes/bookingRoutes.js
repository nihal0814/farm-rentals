const express = require('express');
const router = express.Router();
const { createBooking, getMyBookings, updateBookingStatus } = require('../controllers/bookingController');
const { protect } = require('../middlewares/authMiddleware');

// Both routes are protected by the auth middleware
router.route('/')
  .post(protect, createBooking)
  .get(protect, getMyBookings);

router.route('/:id')
  .put(protect, updateBookingStatus);

module.exports = router;