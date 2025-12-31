const bcrypt = require('bcryptjs');
const { readJSON, writeJSON } = require('../utils/fileHelper');

async function initAdmin() {
  try {
    const users = await readJSON('data/users.json');
    const superAdmin = users.find(u => u.role === 'superadmin');
    
    if (!superAdmin) {
      console.log('Super admin not found. Creating...');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const newAdmin = {
        id: 'superadmin001',
        fullName: 'Super Admin',
        email: 'admin@reshow.co.zw',
        password: hashedPassword,
        role: 'superadmin',
        isActive: true,
        mustChangePassword: true, // Require password change on first login
        createdAt: new Date().toISOString(),
        lastLogin: null
      };
      users.push(newAdmin);
      await writeJSON('data/users.json', users);
      console.log('Super admin created!');
      console.log('Email: admin@reshow.co.zw');
      console.log('Password: admin123');
    } else {
      console.log('Super admin already exists.');
      console.log('To reset password, edit data/users.json and hash a new password.');
    }
  } catch (error) {
    console.error('Error initializing admin:', error);
  }
}

initAdmin();

