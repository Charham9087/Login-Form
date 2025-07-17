import mongoose from "mongoose";

const OtpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
    // unique: true   ❌ remove this
  },
  code: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600 // expire after 10 minutes
  }
}, { collection: 'changePassOtp' });

export default mongoose.models.changePassOtp || mongoose.model('changePassOtp', OtpSchema);
