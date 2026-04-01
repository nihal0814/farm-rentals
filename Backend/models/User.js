const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true }, // Will store bcrypt hash
  phoneNumber: { type: String, required: true },
  
  // GeoJSON for geospatial queries (finding nearby users/equipment)
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true }, // [longitude, latitude]
    address: { type: String }
  },
  
  profilePicture: { type: String }, // URL from Cloudinary/AWS S3
  isVerified: { type: Boolean, default: false }, // Identity verification
}, { timestamps: true });

// Create a 2dsphere index so we can efficiently search by distance
userSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('User', userSchema);