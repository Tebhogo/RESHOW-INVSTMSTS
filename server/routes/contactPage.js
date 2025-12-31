const express = require('express');
const { readJSON, writeJSON } = require('../utils/fileHelper');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Get contact page content (public)
router.get('/', async (req, res) => {
  try {
    const content = await readJSON('data/contactContent.json');
    res.json(content);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update contact page content (admin only)
router.put('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const updatedContent = req.body;
    
    // Preserve metadata fields
    const existingContent = await readJSON('data/contactContent.json');
    updatedContent.createdAt = existingContent.createdAt;
    updatedContent.createdBy = existingContent.createdBy;
    updatedContent.updatedAt = new Date().toISOString();
    
    await writeJSON('data/contactContent.json', updatedContent);
    res.json({ message: 'Contact page content updated successfully', content: updatedContent });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

