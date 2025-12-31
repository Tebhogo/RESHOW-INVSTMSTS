const express = require('express');
const { readJSON, writeJSON } = require('../utils/fileHelper');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Get services page content (public)
router.get('/', async (req, res) => {
  try {
    const content = await readJSON('data/servicesContent.json').catch(() => ({}));
    res.json(content);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get services page content (public) - alternative route
router.get('/content', async (req, res) => {
  try {
    const content = await readJSON('data/servicesContent.json').catch(() => ({}));
    res.json(content);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update services page content (admin only)
router.put('/content', authenticate, requireAdmin, async (req, res) => {
  try {
    const updatedContent = req.body;
    
    // Preserve metadata fields
    const existingContent = await readJSON('data/servicesContent.json');
    updatedContent.createdAt = existingContent.createdAt;
    updatedContent.createdBy = existingContent.createdBy;
    updatedContent.updatedAt = new Date().toISOString();
    
    await writeJSON('data/servicesContent.json', updatedContent);
    res.json({ message: 'Services page content updated successfully', content: updatedContent });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all service items (public - for frontend display)
router.get('/items', async (req, res) => {
  try {
    const content = await readJSON('data/servicesContent.json').catch(() => ({ services: [] }));
    res.json(content.services || []);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create a new service item (admin only)
router.post('/items', authenticate, requireAdmin, async (req, res) => {
  try {
    const { title, description, image, category, rating } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }
    
    const content = await readJSON('data/servicesContent.json').catch(() => ({ services: [] }));
    if (!content.services) {
      content.services = [];
    }
    
    const newService = {
      id: `service_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title,
      description: description || '',
      image: image || '',
      category: category || '',
      rating: req.body.rating || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    content.services.push(newService);
    content.updatedAt = new Date().toISOString();
    
    await writeJSON('data/servicesContent.json', content);
    res.status(201).json(newService);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update a service item (admin only)
router.put('/items/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, image, category, rating } = req.body;
    
    const content = await readJSON('data/servicesContent.json').catch(() => ({ services: [] }));
    if (!content.services) {
      content.services = [];
    }
    
    const serviceIndex = content.services.findIndex(s => s.id === id);
    if (serviceIndex === -1) {
      return res.status(404).json({ error: 'Service not found' });
    }
    
    if (title !== undefined) content.services[serviceIndex].title = title;
    if (description !== undefined) content.services[serviceIndex].description = description;
    if (image !== undefined) content.services[serviceIndex].image = image;
    if (category !== undefined) content.services[serviceIndex].category = category;
    if (rating !== undefined) content.services[serviceIndex].rating = rating;
    content.services[serviceIndex].updatedAt = new Date().toISOString();
    content.updatedAt = new Date().toISOString();
    
    await writeJSON('data/servicesContent.json', content);
    res.json(content.services[serviceIndex]);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete a service item (admin only)
router.delete('/items/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const content = await readJSON('data/servicesContent.json').catch(() => ({ services: [] }));
    if (!content.services) {
      content.services = [];
    }
    
    const serviceIndex = content.services.findIndex(s => s.id === id);
    if (serviceIndex === -1) {
      return res.status(404).json({ error: 'Service not found' });
    }
    
    content.services.splice(serviceIndex, 1);
    content.updatedAt = new Date().toISOString();
    
    await writeJSON('data/servicesContent.json', content);
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Rate service (public)
router.post('/items/:id/rate', async (req, res) => {
  try {
    const { id } = req.params;
    const { rating } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    const content = await readJSON('data/servicesContent.json').catch(() => ({ services: [] }));
    if (!content.services) {
      content.services = [];
    }

    const serviceIndex = content.services.findIndex(s => s.id === id);
    if (serviceIndex === -1) {
      return res.status(404).json({ error: 'Service not found' });
    }

    // Update service rating
    content.services[serviceIndex].rating = rating;
    content.services[serviceIndex].updatedAt = new Date().toISOString();
    content.updatedAt = new Date().toISOString();

    await writeJSON('data/servicesContent.json', content);
    res.json({ message: 'Service rated successfully', service: content.services[serviceIndex] });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

