const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/quotes', require('./routes/quotes'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/about', require('./routes/about'));
app.use('/api/home', require('./routes/home'));
app.use('/api/services-content', require('./routes/services'));
app.use('/api/contact-page', require('./routes/contactPage'));
app.use('/api/content', require('./routes/content'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/visitors', require('./routes/visitors'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Reshow API is running' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
});

module.exports = app;
