const mongoose = require('mongoose');
const VehicleSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, enum: ['car', 'bike'], required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true }, // Image URL
    available: { type: Boolean, default: true }
});
module.exports = mongoose.model('Vehicle', VehicleSchema);