const express = require('express');
const multer = require('multer');
const path = require('path');
const { readJSON, writeJSON } = require('../utils/fileHelper');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/home'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed'));
  }
});

// Ensure upload directory exists
const fs = require('fs');
const uploadDir = path.join(__dirname, '../uploads/home');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Get home page content (public)
router.get('/', async (req, res) => {
  try {
    const content = await readJSON('data/homeContent.json');
    res.json(content);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update home page content (admin only)
router.put('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const updatedContent = req.body;
    
    // Preserve metadata fields
    const existingContent = await readJSON('data/homeContent.json');
    updatedContent.createdAt = existingContent.createdAt;
    updatedContent.createdBy = existingContent.createdBy;
    updatedContent.updatedAt = new Date().toISOString();
    
    await writeJSON('data/homeContent.json', updatedContent);
    res.json({ message: 'Home page content updated successfully', content: updatedContent });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Upload image for home page (admin only)
router.post('/upload-image', authenticate, requireAdmin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const imageUrl = `/uploads/home/${req.file.filename}`;
    res.json({ imageUrl, message: 'Image uploaded successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

