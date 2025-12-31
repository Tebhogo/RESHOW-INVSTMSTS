const express = require('express');
const { readJSON } = require('../utils/fileHelper');

const router = express.Router();

// Public endpoint to get all content sections (for frontend display)
// This must come before the :sectionId route
router.get('/', async (req, res) => {
  try {
    const content = await readJSON('data/content.json').catch(() => ({}));
    res.json(content);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Public endpoint to get specific content section (for frontend display)
router.get('/:sectionId', async (req, res) => {
  try {
    const content = await readJSON('data/content.json').catch(() => ({}));
    res.json(content[req.params.sectionId] || {});
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

