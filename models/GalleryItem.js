const mongoose = require('mongoose');

const galleryItemSchema = new mongoose.Schema({
  photos: [{ type: String }],
  lte: { type: String, default: '' },
  len: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('GalleryItem', galleryItemSchema);
