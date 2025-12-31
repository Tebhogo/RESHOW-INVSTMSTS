const express = require('express');
const { readJSON, writeJSON } = require('../utils/fileHelper');

const router = express.Router();

// Track visitor (public - called on page load)
router.post('/track', async (req, res) => {
  try {
    const visitors = await readJSON('data/visitors.json').catch(() => ({ 
      totalVisitors: 0,
      lastReset: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));

    // Increment visitor count
    visitors.totalVisitors = (visitors.totalVisitors || 0) + 1;
    visitors.updatedAt = new Date().toISOString();

    await writeJSON('data/visitors.json', visitors);
    res.json({ success: true, totalVisitors: visitors.totalVisitors });
  } catch (error) {
    console.error('Error tracking visitor:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get visitor count (public)
router.get('/', async (req, res) => {
  try {
    const visitors = await readJSON('data/visitors.json').catch(() => ({ totalVisitors: 0 }));
    res.json({ totalVisitors: visitors.totalVisitors || 0 });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

