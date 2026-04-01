const express = require('express');
const router = express.Router();
const { 
  createEquipment, 
  getEquipment, 
  getEquipmentById 
} = require('../controllers/equipmentController');
const { protect } = require('../middlewares/authMiddleware');

// Mount routes
// GET /api/equipment is public, POST /api/equipment is protected
router.route('/')
  .get(getEquipment)
  .post(protect, createEquipment);

// GET /api/equipment/:id is public
router.route('/:id')
  .get(getEquipmentById);

module.exports = router;