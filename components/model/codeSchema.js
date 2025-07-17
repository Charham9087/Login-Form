import mongoose from 'mongoose'

const Code = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    code: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 600 // ⏰ expire after 600 seconds (10 minutes)
    }
}, 
{ timestamps: true, collection: 'otpCode' }


)


export default mongoose.models.otpCode || mongoose.model('otpCode', Code)

