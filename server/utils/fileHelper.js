const fs = require('fs').promises;
const path = require('path');

/**
 * Read JSON file and return parsed data
 */
async function readJSON(filePath) {
  try {
    const fullPath = path.join(__dirname, '..', filePath);
    const data = await fs.readFile(fullPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist, return appropriate default based on file type
    if (error.code === 'ENOENT') {
      // Return empty array for array-based files (users, quotes, products)
      if (filePath.includes('users') || filePath.includes('quotes') || filePath.includes('products')) {
        return [];
      }
      // Return empty object for content files (aboutContent, homeContent, etc.)
      return {};
    }
    throw error;
  }
}

/**
 * Write data to JSON file
 */
async function writeJSON(filePath, data) {
  try {
    const fullPath = path.join(__dirname, '..', filePath);
    const dir = path.dirname(fullPath);
    
    // Ensure directory exists
    await fs.mkdir(dir, { recursive: true });
    
    // Write file with pretty formatting
    await fs.writeFile(fullPath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  readJSON,
  writeJSON
};

