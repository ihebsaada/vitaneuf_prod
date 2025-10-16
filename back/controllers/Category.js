import Category from '../models/Category.js';

// Create category
export const createCategory = async (req, res) => {
  try {
    const category = new Category({ name: req.body.name });
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ message: 'Category creation failed', error: err.message });
  }
};

// Get all categories
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch categories', error: err.message });
  }
};



// Update category by ID
export const updateCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const updatedData = req.body;

    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      updatedData,
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json(updatedCategory);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update category', error: err.message });
  }
};

// Delete category by ID
export const deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;

    const deletedCategory = await Category.findByIdAndDelete(categoryId);

    if (!deletedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete category', error: err.message });
  }
};
