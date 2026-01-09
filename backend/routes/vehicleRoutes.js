const express = require('express');
const { 
    addVehicle, 
    getVehicles, 
    deleteVehicle, 
    editVehicle, 
    toggleAvailability 
} = require('../controllers/vehicleController');

const protect = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', getVehicles);
router.post('/', protect, addVehicle);
router.delete('/:id', protect, deleteVehicle);
router.put('/edit/:id', protect, editVehicle);
router.put('/status/:id', protect, toggleAvailability);

module.exports = router;