const Booking = require('../models/Booking');

exports.createBooking = async (req, res) => {
    try {
        const userId = req.user ? (req.user.userId || req.user.id || req.user._id) : null;

        if (!userId) {
            return res.status(401).json({ error: "User not authenticated. Please Log in again." });
        }

        const booking = await Booking.create({ 
            ...req.body, 
            user: userId 
        });

        res.status(201).json({ message: "Booking Confirmed", booking });

    } catch (err) { 
        console.error(err.message); 
        res.status(400).json({ error: err.message || "Booking Failed" }); 
    }
};

exports.getMyBookings = async (req, res) => {
    try {
        const userId = req.user ? (req.user.userId || req.user.id || req.user._id) : null;
        if (!userId) return res.status(401).json({ error: "Unauthorized" });

        const bookings = await Booking.find({ user: userId }).populate('vehicle');
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch bookings" });
    }
};

exports.deleteBooking = async (req, res) => {
    try {
        await Booking.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Booking Deleted Successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete booking" });
    }
};

exports.getAllBookings = async (req, res) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ error: "Access Denied: Admins Only" });
    }

    try {
        const bookings = await Booking.find()
            .populate('user', 'name email')   
            .populate('vehicle', 'name');     
        
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch bookings" });
    }
};