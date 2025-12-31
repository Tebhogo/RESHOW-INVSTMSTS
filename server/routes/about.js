const express = require('express');
const { readJSON, writeJSON } = require('../utils/fileHelper');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Get about page content (public)
router.get('/', async (req, res) => {
  try {
    const content = await readJSON('data/aboutContent.json');
    res.json(content);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update about page content (admin only)
router.put('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const updatedContent = req.body;
    
    // Preserve metadata fields
    const existingContent = await readJSON('data/aboutContent.json');
    if (existingContent.createdAt) updatedContent.createdAt = existingContent.createdAt;
    if (existingContent.createdBy) updatedContent.createdBy = existingContent.createdBy;
    updatedContent.updatedAt = new Date().toISOString();
    
    await writeJSON('data/aboutContent.json', updatedContent);
    res.json({ message: 'About page content updated successfully', content: updatedContent });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

