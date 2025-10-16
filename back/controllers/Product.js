import mongoose from 'mongoose';
import Product from '../models/Product.js';

// ✅ Create a new product
export const createProduct = async (req, res) => {
  try {
    const { name, category, description, details, image, available } = req.body;

    // Validate category is a valid ObjectId string
    if (!mongoose.Types.ObjectId.isValid(category)) {
      return res.status(400).json({ message: 'Invalid category ID format' });
    }

    const product = new Product({
      name,
      category, // store as ObjectId string from frontend
      description,
      details,   // Should be an array of { key, value }
      image,
      available
    });

    await product.save();console.log(product)

    res.status(201).json({ message: 'Product created', product });
  } catch (err) {
    res.status(500).json({ message: 'Product creation failed', error: err.message });
    console.log(err,product)
  }
};

// 📄 Get all products
export const getAllProducts = async (req, res) => {
  try {
    // Populate category to get full category info instead of ObjectId
    const products = await Product.find().populate('category');
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch products', error: err.message });
  }
};

// 🔍 Get product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category');
    if (!product) return res.status(404).json({ message: 'Product not found' });

    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching product', error: err.message });
  }
};

// ✏️ Update product
export const updateProduct = async (req, res) => {
  try {
    const { name, category, description, details, image, available } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (name) product.name = name;
    if (category) {
      if (!mongoose.Types.ObjectId.isValid(category)) {
        return res.status(400).json({ message: 'Invalid category ID format' });
      }
      product.category = category;
    }
    if (description) product.description = description;
    if (details) product.details = details;
    if (image) product.image = image;
    if (available !== undefined) product.available = available;

    await product.save();

    // Return updated product with populated category
    const updatedProduct = await Product.findById(product._id).populate('category');

    res.status(200).json({ message: 'Product updated', product: updatedProduct });
  } catch (err) {
    res.status(500).json({ message: 'Product update failed', error: err.message });
  }
};

// ❌ Delete product
export const deleteProduct = async (req, res) => {
  try {
    const result = await Product.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ message: 'Product not found' });

    res.status(200).json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Delete failed', error: err.message });
  }
};
