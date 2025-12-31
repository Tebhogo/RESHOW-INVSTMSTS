const jwt = require('jsonwebtoken');
const { readJSON } = require('../utils/fileHelper');

/**
 * Verify JWT token
 */
const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'reshow-secret-key');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

/**
 * Check if user is admin or superadmin
 */
const requireAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    // Check if user is active
    const users = await readJSON('data/users.json');
    const user = users.find(u => u.id === req.user.userId);
    
    if (!user || !user.isActive) {
      return res.status(403).json({ error: 'Account disabled' });
    }

    next();
  } catch (error) {
    return res.status(500).json({ error: 'Server error' });
  }
};

/**
 * Check if user is superadmin only
 */
const requireSuperAdmin = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== 'superadmin') {
      return res.status(403).json({ error: 'Super admin access required' });
    }
    next();
  } catch (error) {
    return res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  authenticate,
  requireAdmin,
  requireSuperAdmin
};

