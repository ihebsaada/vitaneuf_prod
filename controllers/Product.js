import mongoose from 'mongoose';
import Product from '../models/Product.js';

// ✅ Create a new product
export const createProduct = async (req, res) => {
  try {
    const { name, category, description, details, available } = req.body;
    
    // Parse details if it's sent as a string (from form data)
    const parsedDetails = typeof details === 'string' ? JSON.parse(details) : details;

    // Validate category is a valid ObjectId string
    if (!mongoose.Types.ObjectId.isValid(category)) {
      return res.status(400).json({ message: 'Invalid category ID format' });
    }

    // Get image path from multer if uploaded
    const imagePath = req.file ? `/uploads/${req.file.filename}` : '';

    const product = new Product({
      name,
      category, // store as ObjectId string from frontend
      description,
      details: parsedDetails,   // Should be an array of { key, value }
      image: imagePath,
      available: available === 'true' || available === true
    });

    await product.save();

    res.status(201).json({ message: 'Product created', product });
  } catch (err) {
    res.status(500).json({ message: 'Product creation failed', error: err.message });
    console.log(err);
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
    const { name, category, description, details, available } = req.body;
    
    // Parse details if it's sent as a string (from form data)
    const parsedDetails = typeof details === 'string' ? JSON.parse(details) : details;
    
    // Validate category is a valid ObjectId string
    if (category && !mongoose.Types.ObjectId.isValid(category)) {
      return res.status(400).json({ message: 'Invalid category ID format' });
    }

    // Get image path from multer if uploaded
    const updateData = {
      name,
      category,
      description,
      details: parsedDetails,
      available: available === 'true' || available === true
    };

    // Only update image if a new file was uploaded
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id, 
      updateData,
      { new: true, runValidators: true }
    ).populate('category');

    if (!product) return res.status(404).json({ message: 'Product not found' });

    res.status(200).json({ message: 'Product updated', product });
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
