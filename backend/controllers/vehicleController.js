const Vehicle = require('../models/Vehicle');

exports.getVehicles = async (req, res) => {
    try {
        const vehicles = await Vehicle.find();
        res.json(vehicles);
    } catch (err) {
        res.status(500).json({ error: "Server Error" });
    }
};

exports.addVehicle = async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: "Admin Access Only" });
    try {
        const vehicle = await Vehicle.create(req.body);
        res.status(201).json(vehicle);
    } catch (err) { res.status(400).json({ error: "Error adding vehicle" }); }
};

exports.toggleAvailability = async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: "Access Denied" });
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

exports.editVehicle = async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: "Access Denied" });
    try {
        const updatedVehicle = await Vehicle.findByIdAndUpdate(
            req.params.id,
            req.body, 
            { new: true } 
        );
        res.json(updatedVehicle);
    } catch (err) {
        res.status(500).json({ error: "Failed to update vehicle" });
    }
};

exports.deleteVehicle = async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: "Access Denied" });
    try {
        await Vehicle.findByIdAndDelete(req.params.id);
        res.json({ message: "Vehicle Deleted Successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete vehicle" });
    }
};