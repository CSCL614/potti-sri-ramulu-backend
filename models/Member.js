const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, default: '' },
  photo: { type: String, default: '' },
  isMain: { type: String, enum: ['Yes', 'No'], default: 'No' },
  showPublic: { type: String, enum: ['Yes', 'No'], default: 'Yes' },
  father: { type: String, default: '' },
  mobile: { type: String, required: true },
  email: { type: String, default: '' },
  village: { type: String, default: '' },
  mandal: { type: String, default: '' },
  district: { type: String, default: '' },
  age: { type: Number, default: null },
  occ: { type: String, default: '' },
  type: { type: String, enum: ['General', 'Life', 'Patron', 'Volunteer'], default: 'General' },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  notes: { type: String, default: '' },
  joined: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Member', memberSchema);
