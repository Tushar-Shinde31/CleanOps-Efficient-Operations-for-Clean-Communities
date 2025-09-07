const mongoose = require('mongoose');

const CommunityProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  ward: { type: String, required: true },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0,0] }, // [lng, lat]
    address: String
  },
  wasteType: { type: String, enum: ['sewage','household','industrial','other'], default: 'household' },
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  status: { type: String, enum: ['Planning','Active','Completed','Cancelled'], default: 'Planning' },
  targetDate: Date,
  completedDate: Date,
  photos: [{ url: String, public_id: String }],
  notes: [{
    by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    role: String,
    text: String,
    photos: [{ url: String, public_id: String }],
    createdAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

// Indexes
CommunityProjectSchema.index({ ward: 1, status: 1 });
CommunityProjectSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('CommunityProject', CommunityProjectSchema);
