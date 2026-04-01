const Booking = require('../models/Booking');
const Equipment = require('../models/Equipment');

// @desc    Create a new booking request
// @route   POST /api/bookings
// @access  Private (Requires Token)
const createBooking = async (req, res) => {
  try {
    const { equipmentId, startDate, endDate } = req.body;

    // 1. Check if the equipment exists
    const equipment = await Equipment.findById(equipmentId);
    if (!equipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }

    // You cannot rent your own equipment
    if (equipment.owner.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot rent your own equipment' });
    }

    // 2. Format Dates (Convert incoming strings to actual Date objects)
    const requestedStart = new Date(startDate);
    const requestedEnd = new Date(endDate);

    // 3. THE MAGIC: Check for Date Overlaps
    // Find any booking for this equipment that is 'Approved' or 'Active'
    // where the dates overlap with the requested dates.
    const overlappingBookings = await Booking.find({
      equipment: equipmentId,
      status: { $in: ['Approved', 'Active'] },
      $or: [
        {
          startDate: { $lte: requestedEnd },
          endDate: { $gte: requestedStart }
        }
      ]
    });

    if (overlappingBookings.length > 0) {
      return res.status(400).json({ message: 'Equipment is already booked for these dates' });
    }

    // 4. Calculate the Costs
    // Calculate the difference in time, then convert from milliseconds to days
    const timeDifference = requestedEnd.getTime() - requestedStart.getTime();
    const totalDays = Math.ceil(timeDifference / (1000 * 3600 * 24)); // Round up to nearest whole day

    if (totalDays <= 0) {
      return res.status(400).json({ message: 'End date must be after start date' });
    }

    const rentalCost = totalDays * equipment.pricing.dailyRate;
    const platformFee = rentalCost * 0.10; // Let's say your app takes a 10% cut
    const totalAmount = rentalCost + equipment.pricing.depositAmount + platformFee;

    // 5. Create the Booking entry
    const booking = await Booking.create({
      equipment: equipmentId,
      renter: req.user._id,
      owner: equipment.owner,
      startDate: requestedStart,
      endDate: requestedEnd,
      financials: {
        rentalCost,
        deposit: equipment.pricing.depositAmount,
        platformFee,
        totalAmount
      },
      status: 'Pending' // Requires the owner to approve it later
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged-in user's bookings (either as renter or owner)
// @route   GET /api/bookings
// @access  Private
const getMyBookings = async (req, res) => {
  try {
    // Find bookings where the user is EITHER the renter OR the owner
    const bookings = await Booking.find({
      $or: [{ renter: req.user._id }, { owner: req.user._id }]
    }).populate('equipment', 'title images'); // Pull in basic equipment info

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a booking status (Approve/Reject)
// @route   PUT /api/bookings/:id
// @access  Private (Owner only)
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Ensure only the owner can update the status
    if (booking.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'User not authorized to update this booking' });
    }

    // Basic validation
    if (!['Approved', 'Rejected', 'Active', 'Completed', 'Cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    booking.status = status;
    await booking.save();

    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  updateBookingStatus
};