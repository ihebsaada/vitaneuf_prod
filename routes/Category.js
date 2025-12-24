import express from 'express';
import {
createCategory,
getAllCategories,
updateCategory,
deleteCategory
} from '../controllers/Category.js';

const router = express.Router();

router.post('/add', createCategory);            
router.get('/', getAllCategories);  
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);

         

export default router;
