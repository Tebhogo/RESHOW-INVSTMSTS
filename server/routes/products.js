const express = require('express');
const { readJSON, writeJSON } = require('../utils/fileHelper');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all products (public)
router.get('/', async (req, res) => {
  try {
    const products = await readJSON('data/products.json');
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get product by ID (public)
router.get('/:id', async (req, res) => {
  try {
    const products = await readJSON('data/products.json');
    const product = products.find(p => p.id === req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create product (admin only)
router.post('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const { name, category, description, image, rating } = req.body;

    if (!name || !category || !description) {
      return res.status(400).json({ error: 'Name, category, and description required' });
    }

    const products = await readJSON('data/products.json');
    const newProduct = {
      id: `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      category,
      description,
      image: image || '/images/placeholder.jpg',
      rating: rating || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    products.push(newProduct);
    await writeJSON('data/products.json', products);

    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update product (admin only)
router.put('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const { name, category, description, image, rating } = req.body;
    const products = await readJSON('data/products.json');
    const productIndex = products.findIndex(p => p.id === req.params.id);

    if (productIndex === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }

    products[productIndex] = {
      ...products[productIndex],
      name: name !== undefined ? name : products[productIndex].name,
      category: category !== undefined ? category : products[productIndex].category,
      description: description !== undefined ? description : products[productIndex].description,
      image: image !== undefined ? image : products[productIndex].image,
      rating: rating !== undefined ? rating : (products[productIndex].rating || 0),
      updatedAt: new Date().toISOString()
    };

    await writeJSON('data/products.json', products);
    res.json(products[productIndex]);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete product (admin only)
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const products = await readJSON('data/products.json');
    const filteredProducts = products.filter(p => p.id !== req.params.id);

    if (products.length === filteredProducts.length) {
      return res.status(404).json({ error: 'Product not found' });
    }

    await writeJSON('data/products.json', filteredProducts);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Rate product (public)
router.post('/:id/rate', async (req, res) => {
  try {
    const { id } = req.params;
    const { rating } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    const products = await readJSON('data/products.json');
    const productIndex = products.findIndex(p => p.id === id);

    if (productIndex === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Update product rating (simple: replace with new rating, or could calculate average)
    products[productIndex].rating = rating;
    products[productIndex].updatedAt = new Date().toISOString();

    await writeJSON('data/products.json', products);
    res.json({ message: 'Product rated successfully', product: products[productIndex] });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

