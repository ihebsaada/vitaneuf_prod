import mongoose from 'mongoose';

const detailSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true
  },
  value: {
    type: mongoose.Schema.Types.Mixed, // Can be string, number, boolean, etc.
    required: true
  }
}, { _id: false }); // Avoid separate _id for each detail

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  // Changed from String to ObjectId referencing Category model
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },

  description: {
    type: String,
    trim: true
  },

  details: [detailSchema], // Flexible list of { key, value }

  image: {
    type: String,
    default: '' // Optional image URL or file path
  },

  available: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const Product = mongoose.model('Product', productSchema);

export default Product;
