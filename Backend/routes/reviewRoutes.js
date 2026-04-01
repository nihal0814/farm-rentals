const express = require('express');
const router = express.Router();
const { createReview, getEquipmentReviews } = require('../controllers/reviewController');
const { protect } = require('../middlewares/authMiddleware');

// POST a new review (Protected)
router.route('/').post(protect, createReview);

// GET all reviews for a specific tractor (Public)
router.route('/equipment/:equipmentId').get(getEquipmentReviews);

module.exports = router;