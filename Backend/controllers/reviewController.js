const Review = require('../models/Review');
const Booking = require('../models/Booking');
const Equipment = require('../models/Equipment');

// @desc    Create a new review
// @route   POST /api/reviews
// @access  Private (Requires Token)
const createReview = async (req, res) => {
  try {
    const { bookingId, rating, comment } = req.body;

    // 1. Verify the booking exists and belongs to the logged-in user
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.renter.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only review your own rentals' });
    }

    // 2. Ensure the rental is actually complete before they can review it
    if (booking.status !== 'Completed') {
      return res.status(400).json({ message: 'You can only review completed rentals' });
    }

    // 3. Check if they already reviewed this exact booking
    const alreadyReviewed = await Review.findOne({ booking: bookingId });
    if (alreadyReviewed) {
      return res.status(400).json({ message: 'You have already reviewed this rental' });
    }

    // 4. Create the review
    const review = await Review.create({
      booking: bookingId,
      equipment: booking.equipment,
      reviewer: req.user._id,
      rating: Number(rating),
      comment
    });

    // 5. Update the Equipment's average rating
    // Find all reviews for this specific equipment
    const allReviews = await Review.find({ equipment: booking.equipment });
    
    // Calculate the new average
    const totalReviews = allReviews.length;
    const sumRatings = allReviews.reduce((acc, item) => item.rating + acc, 0);
    const averageRating = sumRatings / totalReviews;

    // Save the new stats back to the Equipment model
    await Equipment.findByIdAndUpdate(booking.equipment, {
      ratingSummary: {
        averageRating: parseFloat(averageRating.toFixed(1)), // Round to 1 decimal (e.g., 4.5)
        totalReviews
      }
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all reviews for a specific piece of equipment
// @route   GET /api/reviews/equipment/:equipmentId
// @access  Public
const getEquipmentReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ equipment: req.params.equipmentId })
      .populate('reviewer', 'firstName lastName profilePicture')
      .sort({ createdAt: -1 }); // Show newest reviews first

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createReview,
  getEquipmentReviews
};