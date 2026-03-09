const mongoose = require('mongoose');

const FormSchema = new mongoose.Schema({
    formType: String, // 'contact' ya 'career'
    name: String,
    email: String,
    phone: String,
    subject: String, // Product ya Job role
    message: String,
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Form', FormSchema);