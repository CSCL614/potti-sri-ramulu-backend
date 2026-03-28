const mongoose = require('mongoose');

const trustCardSchema = new mongoose.Schema({
  photo: { type: String, default: '' },
  tte: { type: String, required: true },
  ten: { type: String, required: true },
  cte: { type: String, default: '' },
  cen: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('TrustCard', trustCardSchema);
