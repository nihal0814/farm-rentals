const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, trim: true }, // e.g., "Massey Ferguson 240 Tractor"
  category: { 
    type: String, 
    enum: ['Tractor', 'Harvester', 'Tiller', 'Seeder', 'Trailer', 'Other'],
    required: true 
  },
  
  // Breakdown of pricing
  pricing: {
    dailyRate: { type: Number, required: true },
    depositAmount: { type: Number, required: true }, // Security deposit
  },
  
  specifications: {
    make: { type: String },
    model: { type: String },
    year: { type: Number }
  },
  
  description: { type: String, required: true },
  images: [{ type: String, required: true }], // Array of image URLs
  
  // Optional: Specific location if stored somewhere other than owner's home address
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number] }, // [longitude, latitude]
  },
  
  isActive: { type: Boolean, default: true }, // Owner can pause their listing
  
  // Denormalized rating stats for fast querying
  ratingSummary: {
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    totalReviews: { type: Number, default: 0 }
  }
}, { timestamps: true });

equipmentSchema.index({ location: '2dsphere' });
equipmentSchema.index({ category: 1, isActive: 1 }); // Compound index for fast filtering

module.exports = mongoose.model('Equipment', equipmentSchema);