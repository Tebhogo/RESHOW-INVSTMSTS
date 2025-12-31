const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { readJSON, writeJSON } = require('../utils/fileHelper');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const users = await readJSON('data/users.json');
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Auto-disable users created 24+ hours ago who haven't changed password
    if (user.createdAt && user.mustChangePassword) {
      const createdAt = new Date(user.createdAt);
      const now = new Date();
      const hoursSinceCreation = (now - createdAt) / (1000 * 60 * 60);
      
      if (hoursSinceCreation >= 24) {
        // Check if user is still using default password
        const isDefaultAdmin123 = await bcrypt.compare('admin123', user.password);
        const isDefault12345 = await bcrypt.compare('12345', user.password);
        const isDefaultPassword = isDefaultAdmin123 || isDefault12345;
        
        if (isDefaultPassword) {
          // Disable the user
          user.isActive = false;
          await writeJSON('data/users.json', users);
          return res.status(403).json({ 
            error: 'Account has been disabled. Please contact administrator. Your account was disabled because you did not change your default password within 24 hours.' 
          });
        }
      }
    }

    if (!user.isActive) {
      return res.status(403).json({ error: 'Account disabled' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if user is using default password (admin123 or 12345)
    const isDefaultAdmin123 = await bcrypt.compare('admin123', user.password);
    const isDefault12345 = await bcrypt.compare('12345', user.password);
    const isDefaultPassword = isDefaultAdmin123 || isDefault12345;
    
    // Check if user needs to change password (either flagged or using default)
    if (user.mustChangePassword || isDefaultPassword) {
      return res.status(200).json({
        mustChangePassword: true,
        userId: user.id,
        message: 'Password change required. You must change your default password.'
      });
    }

    // Update last login
    user.lastLogin = new Date().toISOString();
    await writeJSON('data/users.json', users);

    // Generate token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'reshow-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Change password
router.post('/change-password', async (req, res) => {
  try {
    const { userId, currentPassword, newPassword } = req.body;

    if (!userId || !currentPassword || !newPassword) {
      return res.status(400).json({ error: 'All fields required' });
    }

    // Validate new password strength
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        error: 'Password must be at least 8 characters with uppercase, lowercase, number, and special character'
      });
    }

    const users = await readJSON('data/users.json');
    const user = users.find(u => u.id === userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify current password
    const validPassword = await bcrypt.compare(currentPassword, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Current password incorrect' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.mustChangePassword = false;
    user.lastLogin = new Date().toISOString();

    await writeJSON('data/users.json', users);

    // Generate new token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'reshow-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role
      },
      message: 'Password changed successfully'
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get current user
router.get('/me', authenticate, async (req, res) => {
  try {
    const users = await readJSON('data/users.json');
    const user = users.find(u => u.id === req.user.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Auto-disable users created 24+ hours ago who haven't changed password
    if (user.createdAt && user.mustChangePassword && user.isActive) {
      const createdAt = new Date(user.createdAt);
      const now = new Date();
      const hoursSinceCreation = (now - createdAt) / (1000 * 60 * 60);
      
      if (hoursSinceCreation >= 24) {
        // Check if user is still using default password
        const isDefaultAdmin123 = await bcrypt.compare('admin123', user.password);
        const isDefault12345 = await bcrypt.compare('12345', user.password);
        const isDefaultPassword = isDefaultAdmin123 || isDefault12345;
        
        if (isDefaultPassword) {
          // Disable the user
          user.isActive = false;
          await writeJSON('data/users.json', users);
          return res.status(403).json({ 
            error: 'Account has been disabled. Please contact administrator.' 
          });
        }
      }
    }

    if (!user.isActive) {
      return res.status(403).json({ error: 'Account disabled' });
    }

    res.json({
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      mustChangePassword: user.mustChangePassword
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

