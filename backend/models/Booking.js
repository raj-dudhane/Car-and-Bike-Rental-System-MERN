
const mongoose = require('mongoose');
const BookingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    totalPrice: { type: Number, required: true }
}, { timestamps: true });
module.exports = mongoose.model('Booking', BookingSchema);