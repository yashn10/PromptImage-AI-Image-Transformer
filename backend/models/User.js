const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  tier: { type: String, enum: ['free', 'pro'], default: 'free' },
  dailyTransforms: { type: Number, default: 0 },
  lastTransformDate: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now },
});

// Helper to reset daily quota if it's a new day
UserSchema.methods.checkAndResetDailyQuota = function() {
  if (!this.lastTransformDate) return;
  
  const now = new Date();
  const last = new Date(this.lastTransformDate);
  
  // If it's a different day, reset the count
  if (now.getDate() !== last.getDate() || 
      now.getMonth() !== last.getMonth() || 
      now.getFullYear() !== last.getFullYear()) {
    this.dailyTransforms = 0;
  }
};

module.exports = mongoose.model('User', UserSchema);
