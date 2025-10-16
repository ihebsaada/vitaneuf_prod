import express from 'express';
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct
} from '../controllers/Product.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.post('/', upload.single('image'), createProduct);            
router.get('/', getAllProducts);             
router.get('/:id', getProductById);           
router.put('/:id', upload.single('image'), updateProduct);            
router.delete('/:id', deleteProduct);         

export default router;
