const mongoose = require('mongoose');

const CareerSchema = new mongoose.Schema({
    user_name: { type: String, required: true },
    user_email: { type: String, required: true },
    user_mobile: { type: String, required: true },
    experience: { type: String },
    resumeUrl: { type: String }, // Agar tum file cloud par save karo, warna hum Buffer use karenge
    appliedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Career', CareerSchema);