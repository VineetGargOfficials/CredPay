import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true
    },
    product: {
      type: String,
      required: true
    },
    platform: {
      type: String,
      required: true
    },
    cardId: {
      type: String,
      required: true
    },
    cardName: {
      type: String,
      required: true
    },
    cardVariant: {
      type: String,
      required: true
    },
    seekerEmail: {
      type: String,
      required: true
    },
    seekerName: {
      type: String,
      required: true
    },
    ownerEmail: {
      type: String,
      required: true
    },
    ownerName: {
      type: String,
      required: true
    },
    originalPrice: {
      type: Number,
      required: true
    },
    discountAmount: {
      type: Number,
      default: 0
    },
    productPriceAfterOffer: {
      type: Number,
      required: true
    },
    processingFee: {
      type: Number,
      default: 500
    },
    gatewayCharges: {
      type: Number,
      default: 100
    },
    totalPayable: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Payment', 'Order placed', 'Delivered', 'Completed', 'Cancelled'],
      default: 'Pending'
    },
    step: {
      type: Number,
      default: 1
    },
    trackingNumber: {
      type: String,
      default: ''
    },
    escrowReleased: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

export const Request = mongoose.model('Request', requestSchema);
export default Request;
