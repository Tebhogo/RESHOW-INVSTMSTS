const express = require('express');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const { readJSON, writeJSON } = require('../utils/fileHelper');
const { authenticate, requireAdmin, requireSuperAdmin } = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const fs = require('fs');

// Create storage that uses a default directory first, then we'll move the file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      // Use a temporary location first, we'll determine the final location after body is parsed
      const tempPath = path.join(__dirname, '..', 'uploads', 'temp');
      
      // Ensure temp directory exists
      if (!fs.existsSync(tempPath)) {
        fs.mkdirSync(tempPath, { recursive: true });
      }
      
      cb(null, tempPath);
    } catch (error) {
      console.error('Error setting upload destination:', error);
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = uniqueSuffix + path.extname(file.originalname);
    cb(null, filename);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Get dashboard stats
router.get('/dashboard', authenticate, requireAdmin, async (req, res) => {
  try {
    const products = await readJSON('data/products.json');
    const quotes = await readJSON('data/quotes.json');
    const users = await readJSON('data/users.json');
    const visitors = await readJSON('data/visitors.json').catch(() => ({ totalVisitors: 0 }));

    const stats = {
      totalProducts: products.length,
      totalQuotes: quotes.length,
      pendingQuotes: quotes.filter(q => q.status === 'pending').length,
      totalUsers: users.length,
      activeUsers: users.filter(u => u.isActive).length,
      totalVisitors: visitors.totalVisitors || 0
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create user (superadmin only)
router.post('/users', authenticate, requireSuperAdmin, async (req, res) => {
  try {
    const { fullName, email } = req.body;

    if (!fullName || !email) {
      return res.status(400).json({ error: 'Full name and email required' });
    }

    const users = await readJSON('data/users.json');
    
    // Check if email already exists
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Hash default password
    const defaultPassword = '12345';
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    const newUser = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      fullName,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: 'admin',
      isActive: true,
      mustChangePassword: true,
      createdAt: new Date().toISOString(),
      lastLogin: null
    };

    users.push(newUser);
    await writeJSON('data/users.json', users);

    res.status(201).json({
      id: newUser.id,
      fullName: newUser.fullName,
      email: newUser.email,
      role: newUser.role,
      message: 'User created. Default password: 12345'
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all users (superadmin only)
router.get('/users', authenticate, requireSuperAdmin, async (req, res) => {
  try {
    const users = await readJSON('data/users.json');
    const sanitizedUsers = users.map(u => ({
      id: u.id,
      fullName: u.fullName,
      email: u.email,
      role: u.role,
      isActive: u.isActive,
      mustChangePassword: u.mustChangePassword,
      createdAt: u.createdAt,
      lastLogin: u.lastLogin
    }));
    res.json(sanitizedUsers);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update user (superadmin only)
router.put('/users/:id', authenticate, requireSuperAdmin, async (req, res) => {
  try {
    const { fullName, email, isActive } = req.body;
    const users = await readJSON('data/users.json');
    const userIndex = users.findIndex(u => u.id === req.params.id);

    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (fullName) users[userIndex].fullName = fullName;
    if (email) users[userIndex].email = email.toLowerCase();
    if (typeof isActive === 'boolean') users[userIndex].isActive = isActive;

    await writeJSON('data/users.json', users);
    res.json({
      id: users[userIndex].id,
      fullName: users[userIndex].fullName,
      email: users[userIndex].email,
      role: users[userIndex].role,
      isActive: users[userIndex].isActive
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Change user password (superadmin only - no current password required)
router.put('/users/:id/password', authenticate, requireSuperAdmin, async (req, res) => {
  try {
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({ error: 'New password required' });
    }

    // Validate new password strength
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        error: 'Password must be at least 8 characters with uppercase, lowercase, number, and special character'
      });
    }

    const users = await readJSON('data/users.json');
    const userIndex = users.findIndex(u => u.id === req.params.id);

    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    users[userIndex].password = hashedPassword;
    users[userIndex].mustChangePassword = false; // Clear the must change password flag

    await writeJSON('data/users.json', users);
    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Upload image
router.post('/upload', authenticate, requireAdmin, (req, res, next) => {
  // Handle multer upload with error handling
  upload.single('image')(req, res, (err) => {
    if (err) {
      console.error('Multer error:', err);
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ error: 'File too large. Maximum size is 5MB.' });
        }
        return res.status(400).json({ error: `Upload error: ${err.message}` });
      }
      return res.status(400).json({ error: err.message || 'File upload failed' });
    }
    next();
  });
}, (req, res) => {
  try {
    console.log('Upload request received');
    console.log('Request body:', req.body);
    console.log('Request file:', req.file ? 'File received' : 'No file');
    console.log('Request headers:', req.headers['content-type']);
    
    if (!req.file) {
      console.error('No file in request');
      console.error('Request body keys:', Object.keys(req.body));
      return res.status(400).json({ error: 'No file uploaded. Please select an image file.' });
    }

    // Get upload type from body (available after multer processes form-data)
    const uploadType = (req.body && req.body.uploadType) || 'products';
    console.log('Upload type:', uploadType);
    
    // Move file from temp to final location
    const tempPath = req.file.path;
    const finalDir = path.join(__dirname, '..', 'uploads', uploadType);
    
    // Ensure final directory exists
    if (!fs.existsSync(finalDir)) {
      fs.mkdirSync(finalDir, { recursive: true });
      console.log('Created upload directory:', finalDir);
    }
    
    const finalPath = path.join(finalDir, req.file.filename);
    
    // Move file from temp to final location
    if (tempPath !== finalPath) {
      fs.renameSync(tempPath, finalPath);
      console.log('File moved from', tempPath, 'to', finalPath);
    }
    
    const fileUrl = `/uploads/${uploadType}/${req.file.filename}`;
    
    // Verify file exists at final location
    if (!fs.existsSync(finalPath)) {
      console.error('File not found at final path:', finalPath);
      return res.status(500).json({ error: 'File was not saved correctly' });
    }
    
    console.log('File uploaded successfully:', finalPath);
    console.log('File URL:', fileUrl);
    console.log('File size:', req.file.size);
    
    res.json({
      message: 'File uploaded successfully',
      url: fileUrl,
      filename: req.file.filename,
      uploadType: uploadType,
      size: req.file.size
    });
  } catch (error) {
    console.error('Upload error:', error);
    console.error('Error stack:', error.stack);
    
    // Clean up temp file if it exists
    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (cleanupError) {
        console.error('Error cleaning up temp file:', cleanupError);
      }
    }
    
    res.status(500).json({ error: 'Upload failed: ' + (error.message || 'Unknown error') });
  }
});

// Content Management Routes
// Get all content sections (admin only)
router.get('/content', authenticate, requireAdmin, async (req, res) => {
  try {
    const content = await readJSON('data/content.json').catch(() => ({}));
    res.json(content);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get specific content section (admin only)
router.get('/content/:sectionId', authenticate, requireAdmin, async (req, res) => {
  try {
    const content = await readJSON('data/content.json').catch(() => ({}));
    res.json(content[req.params.sectionId] || {});
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update all content sections
router.put('/content', authenticate, requireAdmin, async (req, res) => {
  try {
    const updatedContent = req.body;
    
    // Preserve metadata
    const existingContent = await readJSON('data/content.json').catch(() => ({}));
    if (existingContent.metadata) {
      updatedContent.metadata = existingContent.metadata;
    }
    updatedContent.updatedAt = new Date().toISOString();
    updatedContent.updatedBy = req.user.userId;
    
    await writeJSON('data/content.json', updatedContent);
    res.json({ message: 'Content updated successfully', content: updatedContent });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update specific content section
router.put('/content/:sectionId', authenticate, requireAdmin, async (req, res) => {
  try {
    const { sectionId } = req.params;
    const sectionData = req.body;
    
    // Protect copyright and design credit
    if (sectionId === 'footer') {
      // Remove any attempts to modify copyright or design credit
      delete sectionData.copyright;
      delete sectionData.designCredit;
    }
    
    const content = await readJSON('data/content.json').catch(() => ({}));
    content[sectionId] = {
      ...content[sectionId],
      ...sectionData,
      updatedAt: new Date().toISOString(),
      updatedBy: req.user.userId
    };
    content.updatedAt = new Date().toISOString();
    
    await writeJSON('data/content.json', content);
    res.json({ message: 'Section updated successfully', section: content[sectionId] });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

