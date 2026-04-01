const Equipment = require('../models/Equipment');

// @desc    Create a new equipment listing
// @route   POST /api/equipment
// @access  Private (Requires Token)
const createEquipment = async (req, res) => {
  try {
    const { title, category, dailyRate, depositAmount, description, images } = req.body;

    const equipment = await Equipment.create({
      owner: req.user._id, // Attached by the protect middleware
      title,
      category,
      pricing: {
        dailyRate,
        depositAmount
      },
      description,
      images: images || ['https://via.placeholder.com/400'], // Fallback image if none provided
      location: {
        type: 'Point',
        coordinates: req.user.location.coordinates // Inherit location from the owner's profile
      }
    });

    res.status(201).json(equipment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Fetch all active equipment
// @route   GET /api/equipment
// @access  Public
const getEquipment = async (req, res) => {
  try {
    // Only find equipment that is marked as active
    // .populate() pulls in the owner's name and email so we don't just see a random ID
    const equipment = await Equipment.find({ isActive: true })
      .populate('owner', 'firstName lastName email');
      
    res.status(200).json(equipment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch a single piece of equipment by ID
// @route   GET /api/equipment/:id
// @access  Public
const getEquipmentById = async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id)
      .populate('owner', 'firstName lastName phoneNumber');

    if (equipment) {
      res.status(200).json(equipment);
    } else {
      res.status(404).json({ message: 'Equipment not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Invalid Equipment ID format' });
  }
};

module.exports = {
  createEquipment,
  getEquipment,
  getEquipmentById
};