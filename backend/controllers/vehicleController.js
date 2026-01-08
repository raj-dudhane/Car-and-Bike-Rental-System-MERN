const Vehicle = require('../models/vehicle');

exports.getVehicles = async (req, res) => {
    const vehicles = await Vehicle.find();
    res.json(vehicles);
};

exports.addVehicle = async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: "Admin Access Only" });
    try {
        const vehicle = await Vehicle.create(req.body);
        res.status(201).json(vehicle);
    } catch (err) { res.status(400).json({ error: "Error adding vehicle" }); }
};

//
exports.toggleAvailability = async (req, res) => {
    
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: "Access Denied" });
    }

    try {
        
        const vehicle = await Vehicle.findById(req.params.id);
        if (!vehicle) return res.status(404).json({ error: "Vehicle not found" });

        
        vehicle.available = !vehicle.available;
        await vehicle.save();

        res.json({ message: "Availability Updated", vehicle });
    } catch (err) {
        res.status(500).json({ error: "Server Error" });
    }
};