import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      default: '',
    },

    price: {
      type: Number,
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    variant: {
      color: String,
      size: String,
    },
  },
  {
    _id: true,
  }
);

const addressSchema = new mongoose.Schema(
  {
    line1: {
      type: String,
      required: true,
    },

    line2: {
      type: String,
      default: '',
    },

    city: {
      type: String,
      required: true,
    },

    state: {
      type: String,
      required: true,
    },

    pincode: {
      type: String,
      required: true,
    },

    country: {
      type: String,
      default: 'India',
    },
  },
  {
    _id: false,
  }
);

// Sequence schema for atomic order number generation
const sequenceSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

const Sequence = mongoose.models.Sequence || mongoose.model('Sequence', sequenceSchema);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
    },

    customer: {
      name: {
        type: String,
        required: true,
      },

      email: {
        type: String,
        required: true,
        lowercase: true,
      },

      phone: {
        type: String,
        required: true,
      },
    },

    shippingAddress: {
      type: addressSchema,
      required: true,
    },

    items: {
      type: [orderItemSchema],
      required: true,
    },

    subtotal: {
      type: Number,
      required: true,
    },

    shippingCost: {
      type: Number,
      default: 0,
    },

    total: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: [
        'pending',
        'confirmed',
        'shipped',
        'delivered',
        'cancelled',
      ],
      default: 'pending',
    },

    paymentStatus: {
      type: String,
      enum: ['unpaid', 'paid', 'refunded'],
      default: 'unpaid',
    },

    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Auto generate order number: CPZ-YYYYMMDD-XXXX
// Uses atomic findOneAndUpdate to eliminate race condition (BUG S-4)
orderSchema.pre('save', async function (next) {
  if (!this.orderNumber) {
    const dateStr = new Date()
      .toISOString()
      .slice(0, 10)
      .replace(/-/g, '');

    const result = await Sequence.findOneAndUpdate(
      { _id: 'orderNumber' },
      { $inc: { seq: 1 } },
      { upsert: true, returnDocument: 'after' }
    );

    this.orderNumber = `CPZ-${dateStr}-${String(result.seq).padStart(4, '0')}`;
  }

  next();
});

const Order = mongoose.model('Order', orderSchema);

export default Order;