const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
  by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  role: String,
  text: String,
  photos: [{ url: String, public_id: String }],
  createdAt: { type: Date, default: Date.now }
});

const FeedbackSchema = new mongoose.Schema({
  rating: { type: Number, min: 1, max: 5 },
  comment: String,
  createdAt: { type: Date, default: Date.now }
});

const RequestSchema = new mongoose.Schema({
  ticketId: { type: String, unique: true, index: true },
  citizen: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  fullName: String,
  mobileNumber: String,
  ward: String,
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0,0] }, // [lng, lat]
    address: String
  },
  wasteType: { type: String, enum: ['sewage','household','industrial','other'], default: 'household' },
  preferredTimeSlot: String,
  description: String,
  photos: [{ url: String, public_id: String }],
  status: { type: String, enum: ['Open','Assigned','On the Way','In Progress','Completed','Rejected'], default: 'Open' },
  assignedOperator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // operator user
  notes: [NoteSchema],
  feedback: FeedbackSchema
}, { timestamps: true });

// Indexes
RequestSchema.index({ ward: 1, status: 1 });
RequestSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Request', RequestSchema);
