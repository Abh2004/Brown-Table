const mongoose = require('mongoose');

const groupMemberSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    required: true
  },
  color: {
    type: String,
    required: true
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  hasAccepted: {
    type: Boolean,
    default: false
  },
  joinedAt: {
    type: Date,
    default: Date.now
  }
});

const groupSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  adminId: {
    type: String,
    required: true
  },
  inviteCode: {
    type: String,
    required: true,
    unique: true
  },
  arrivalTime: {
    type: String,
    required: true
  },
  departureTime: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  table: {
    type: String,
    default: null
  },
  discount: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  groupMembers: [groupMemberSchema],
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active'
  },
  maxMembers: {
    type: Number,
    default: 10,
    min: 1,
    max: 20
  },
  restaurant: {
    type: String,
    default: 'The Brown Table'
  }
}, {
  timestamps: true
});

// Index for faster queries
groupSchema.index({ inviteCode: 1 });
groupSchema.index({ adminId: 1 });
groupSchema.index({ status: 1 });

module.exports = mongoose.model('Group', groupSchema); 