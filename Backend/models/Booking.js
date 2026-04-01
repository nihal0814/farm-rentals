const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  equipment: { type: mongoose.Schema.Types.ObjectId, ref: 'Equipment', required: true },
  renter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  // Crucial for the double-booking check
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  
  financials: {
    rentalCost: { type: Number, required: true }, // (Days * DailyRate)
    deposit: { type: Number, required: true },
    platformFee: { type: Number, required: true }, // Your cut for running the app
    totalAmount: { type: Number, required: true }
  },
  
  // The lifecycle of a rental
  status: {
    type: String,
    enum: [
      'Pending',     // Renter requested, waiting on owner approval
      'Approved',    // Owner approved, waiting for renter to pay
      'Rejected',    // Owner rejected the booking
      'Active',      // Paid, currently in the renter's possession
      'Completed',   // Returned safely
      'Cancelled',   // Cancelled before active
      'Disputed'     // Damage reported or late return
    ],
    default: 'Pending'
  },
  
  paymentStatus: {
    type: String,
    enum: ['Unpaid', 'HeldInEscrow', 'ReleasedToOwner', 'Refunded'],
    default: 'Unpaid'
  }
}, { timestamps: true });

// Index to quickly find overlapping dates for a specific piece of equipment
bookingSchema.index({ equipment: 1, startDate: 1, endDate: 1, status: 1 });

module.exports = mongoose.model('Booking', bookingSchema);