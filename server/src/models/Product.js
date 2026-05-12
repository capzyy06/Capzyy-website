import mongoose from 'mongoose';
import slugify from 'slugify';

const variantSchema = new mongoose.Schema(
  {
    color: {
      type: String,
      trim: true,
    },

    colorHex: {
      type: String,
      default: '#000000',
    },

    size: {
      type: String,
      trim: true,
    },

    stock: {
      type: Number,
      default: 0,
      min: 0,
    },

    sku: {
      type: String,
      trim: true,
    },
  },
  {
    _id: true,
  }
);

const imageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },

    publicId: {
      type: String,
      required: true,
    },
  },
  {
    _id: false,
  }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },

    description: {
      type: String,
      required: true,
    },

    features: [
      {
        type: String,
        trim: true,
      },
    ],

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    compareAtPrice: {
      type: Number,
      default: null,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },

    images: {
      type: [imageSchema],
      default: [],
    },

    variants: {
      type: [variantSchema],
      default: [],
    },

    tags: [
      {
        type: String,
        lowercase: true,
        trim: true,
      },
    ],

    isFeatured: {
      type: Boolean,
      default: false,
    },

    isNewArrival: {
      type: Boolean,
      default: false,
    },

    isBestSeller: {
      type: Boolean,
      default: false,
    },

    stock: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Auto-generate slug
productSchema.pre('save', async function (next) {
  if (this.isModified('name')) {
    const base = slugify(this.name, {
      lower: true,
      strict: true,
    });

    let slug = base;
    let count = 1;

    while (
      await mongoose.model('Product').findOne({
        slug,
        _id: { $ne: this._id },
      })
    ) {
      slug = `${base}-${count++}`;
    }

    this.slug = slug;
  }

  next();
});

// Virtual: discount percentage
productSchema.virtual('discountPercent').get(function () {
  if (
    this.compareAtPrice &&
    this.compareAtPrice > this.price
  ) {
    return Math.round(
      ((this.compareAtPrice - this.price) /
        this.compareAtPrice) *
        100
    );
  }

  return 0;
});

productSchema.index({
  name: 'text',
  tags: 'text',
  description: 'text',
});

productSchema.index({
  category: 1,
  isActive: 1,
});

productSchema.index({
  isFeatured: 1,
  isActive: 1,
});

const Product = mongoose.model(
  'Product',
  productSchema
);

export default Product;