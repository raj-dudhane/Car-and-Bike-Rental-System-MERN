const express = require('express');
const { getVehicles, addVehicle,toggleAvailability } = require('../controllers/vehicleController');
const protect = require('../middleware/authMiddleware');
const router = express.Router();
router.get('/', getVehicles);
router.post('/', protect, addVehicle);
router.put('/:id', protect, toggleAvailability);
module.exports = router;