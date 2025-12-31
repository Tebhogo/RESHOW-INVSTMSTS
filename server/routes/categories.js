const express = require('express');
const { readJSON, writeJSON } = require('../utils/fileHelper');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all categories (public)
router.get('/', async (req, res) => {
  try {
    const categories = await readJSON('data/categories.json');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create category (admin only)
router.post('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Category name is required' });
    }

    const categories = await readJSON('data/categories.json');
    
    // Check if category already exists
    const existingCategory = categories.find(c => c.name.toLowerCase() === name.trim().toLowerCase());
    if (existingCategory) {
      return res.status(400).json({ error: 'Category already exists' });
    }

    const newCategory = {
      id: `cat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: name.trim(),
      createdAt: new Date().toISOString()
    };

    categories.push(newCategory);
    await writeJSON('data/categories.json', categories);

    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete category (admin only)
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const categories = await readJSON('data/categories.json');
    const categoryIndex = categories.findIndex(c => c.id === id);

    if (categoryIndex === -1) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // Check if any products are using this category
    const products = await readJSON('data/products.json').catch(() => []);
    const productsUsingCategory = products.filter(p => p.category === categories[categoryIndex].name);
    
    if (productsUsingCategory.length > 0) {
      return res.status(400).json({ 
        error: `Cannot delete category. ${productsUsingCategory.length} product(s) are using this category. Please reassign or delete those products first.` 
      });
    }

    categories.splice(categoryIndex, 1);
    await writeJSON('data/categories.json', categories);

    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update category (admin only)
router.put('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Category name is required' });
    }

    const categories = await readJSON('data/categories.json');
    const categoryIndex = categories.findIndex(c => c.id === id);

    if (categoryIndex === -1) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // Check if another category with the same name exists
    const existingCategory = categories.find(c => c.id !== id && c.name.toLowerCase() === name.trim().toLowerCase());
    if (existingCategory) {
      return res.status(400).json({ error: 'Category name already exists' });
    }

    const oldName = categories[categoryIndex].name;
    categories[categoryIndex].name = name.trim();

    // Update all products that use this category
    const products = await readJSON('data/products.json').catch(() => []);
    products.forEach(product => {
      if (product.category === oldName) {
        product.category = name.trim();
        product.updatedAt = new Date().toISOString();
      }
    });
    await writeJSON('data/products.json', products);

    await writeJSON('data/categories.json', categories);

    res.json(categories[categoryIndex]);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

