const Booking = require('../models/Booking');

// Create a new booking
exports.createBooking = async (req, res) => {
    try {
        // 👇 CHANGED .id TO .userId
        const booking = await Booking.create({ ...req.body, user: req.user.userId });
        res.status(201).json({ message: "Booking Confirmed", booking });
    } catch (err) { res.status(400).json({ error: "Booking Failed" }); }
};

// Get bookings for logged-in user
exports.getMyBookings = async (req, res) => {
    // 👇 CHANGED .id TO .userId
    const bookings = await Booking.find({ user: req.user.userId }).populate('vehicle');
    res.json(bookings);
};

// Delete a booking by ID
exports.deleteBooking = async (req, res) => {
    try {
        await Booking.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Booking Deleted Successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete booking" });
    }
};

//  Get all bookings with user & vehicle details
exports.getAllBookings = async (req, res) => {
    
    if (req.user.role !== 'admin') {
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