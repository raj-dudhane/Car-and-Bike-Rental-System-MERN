const express = require('express');
const { getVehicles, addVehicle,toggleAvailability ,updateVehicle} = require('../controllers/vehicleController');
const protect = require('../middleware/authMiddleware');
const router = express.Router();
router.get('/', getVehicles);
router.post('/', protect, addVehicle);
router.put('/:id', protect, toggleAvailability);
router.put('/edit/:id', protect, updateVehicle);
module.exports = router;