import mongoose from 'mongoose';

const offerSchema = new mongoose.Schema({
  platform: { type: String, required: true },
  title: { type: String, required: true },
  discountPercent: { type: Number, default: 0 },
  maxDiscount: { type: Number, default: 0 },
  validTill: { type: String, default: '31 Dec' },
  isBestMatch: { type: Boolean, default: false }
});

const cardSchema = new mongoose.Schema(
  {
    bankName: {
      type: String,
      required: true,
      trim: true
    },
    cardNetwork: {
      type: String,
      required: true,
      default: 'VISA'
    },
    cardVariant: {
      type: String,
      required: true,
      trim: true
    },
    last4Digits: {
      type: String,
      required: true,
      maxlength: 4
    },
    limitAvailable: {
      type: Number,
      required: true,
      default: 100000
    },
    processingFee: {
      type: String,
      default: '1% of product value'
    },
    processingFeePercent: {
      type: Number,
      default: 1.0
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    ownerEmail: {
      type: String,
      required: true
    },
    ownerName: {
      type: String,
      required: true
    },
    ownerRating: {
      type: Number,
      default: 4.8
    },
    kycVerified: {
      type: Boolean,
      default: true
    },
    colorGradient: {
      type: String,
      default: 'from-[#4F46E5] to-[#7C3AED]'
    },
    bgHex: {
      type: String,
      default: '#4F46E5'
    },
    offers: [offerSchema]
  },
  {
    timestamps: true
  }
);

export const Card = mongoose.model('Card', cardSchema);
export default Card;
