const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  photo: { type: String, default: '' },
  tte: { type: String, required: true },
  ten: { type: String, required: true },
  dte: { type: String, default: '' },
  den: { type: String, default: '' },
  ldte: { type: String, default: '' },
  lden: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Activity', activitySchema);
