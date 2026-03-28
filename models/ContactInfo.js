const mongoose = require('mongoose');

const contactInfoSchema = new mongoose.Schema({
  addrTe: { type: String, default: '' },
  addrEn: { type: String, default: '' },
  ph: { type: String, default: '' },
  em: { type: String, default: '' },
  hrTe: { type: String, default: '' },
  hrEn: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('ContactInfo', contactInfoSchema);
