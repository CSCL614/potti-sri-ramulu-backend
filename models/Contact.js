const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, default: '' },
  msg: { type: String, required: true },
  date: { type: String, default: '' },
  status: { type: String, enum: ['New', 'Read'], default: 'New' }
}, { timestamps: true });

module.exports = mongoose.model('Contact', contactSchema);
