const mongoose = require('mongoose');

const pottiInfoSchema = new mongoose.Schema({
  nte: { type: String, default: '' },
  nen: { type: String, default: '' },
  dates: { type: String, default: '' },
  p1te: { type: String, default: '' },
  p1en: { type: String, default: '' },
  qte: { type: String, default: '' },
  qen: { type: String, default: '' },
  p2te: { type: String, default: '' },
  p2en: { type: String, default: '' },
  photo: { type: String, default: '' },
  chips: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('PottiInfo', pottiInfoSchema);
