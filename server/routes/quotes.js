const express = require('express');
const { readJSON, writeJSON } = require('../utils/fileHelper');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Submit quote request (public)
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, company, products, message } = req.body;

    if (!name || !email || !products || products.length === 0) {
      return res.status(400).json({ error: 'Name, email, and at least one product required' });
    }

    const quotes = await readJSON('data/quotes.json');
    const newQuote = {
      id: `quote_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      email,
      phone: phone || '',
      company: company || '',
      products,
      message: message || '',
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    quotes.push(newQuote);
    await writeJSON('data/quotes.json', quotes);

    res.status(201).json({ message: 'Quote request submitted successfully', quoteId: newQuote.id });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all quotes (admin only)
router.get('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const quotes = await readJSON('data/quotes.json');
    res.json(quotes);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update quote status (admin only)
router.patch('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const quotes = await readJSON('data/quotes.json');
    const quoteIndex = quotes.findIndex(q => q.id === req.params.id);

    if (quoteIndex === -1) {
      return res.status(404).json({ error: 'Quote not found' });
    }

    quotes[quoteIndex].status = status || quotes[quoteIndex].status;
    quotes[quoteIndex].updatedAt = new Date().toISOString();

    await writeJSON('data/quotes.json', quotes);
    res.json(quotes[quoteIndex]);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

