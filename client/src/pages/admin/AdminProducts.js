import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    image: ''
  });

  // Ensure formData values are always strings
  const safeFormData = {
    name: formData.name || '',
    category: formData.category || (categories.length > 0 ? categories[0].name : ''),
    description: formData.description || '',
    image: formData.image || ''
  };
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      const cats = Array.isArray(res.data) ? res.data : [];
      setCategories(cats);
      // Set default category if formData is empty
      if (cats.length > 0 && !formData.category) {
        setFormData(prev => ({ ...prev, category: cats[0].name }));
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Fallback to default categories if API fails
      setCategories([
        { id: 'cat_1', name: 'Apparel' },
        { id: 'cat_2', name: 'Headwear' },
        { id: 'cat_3', name: 'Promotional Gifts' },
        { id: 'cat_4', name: 'PPE Wear' }
      ]);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products');
      setProducts(Array.isArray(res.data) ? res.data : []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      if (error.response?.status === 400) {
        console.error('Bad request - check if products.json exists and is valid');
      }
      setProducts([]);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Show immediate preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);

    setUploading(true);
    const uploadFormData = new FormData();
    uploadFormData.append('image', file);
    uploadFormData.append('uploadType', 'products');

    try {
      const res = await api.post('/admin/upload', uploadFormData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      // Get the full URL - check if it's already a full URL or needs the base URL
      let imageUrl = res.data.url || '';
      if (imageUrl && !imageUrl.startsWith('http')) {
        // If it's a relative path, make it absolute using the API base URL
        const apiBaseUrl = api.defaults.baseURL || 'http://localhost:3000/api';
        const serverBaseUrl = apiBaseUrl.replace('/api', '');
        imageUrl = `${serverBaseUrl}${imageUrl}`;
      }
      
      setFormData(prev => ({ ...prev, image: imageUrl }));
      // Keep preview showing the uploaded image
      setImagePreview(imageUrl);
    } catch (error) {
      console.error('Image upload error:', error);
      alert(error.response?.data?.error || 'Image upload failed');
      setImagePreview(null);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Use safeFormData to ensure all values are strings
      const dataToSubmit = {
        name: safeFormData.name.trim(),
        category: safeFormData.category,
        description: safeFormData.description.trim(),
        image: safeFormData.image || ''
      };
      
      if (editingProduct) {
        await api.put(`/products/${editingProduct.id}`, dataToSubmit);
      } else {
        await api.post('/products', dataToSubmit);
      }
      fetchProducts();
      resetForm();
    } catch (error) {
      console.error('Error saving product:', error);
      alert(error.response?.data?.error || 'Failed to save product');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    const imageUrl = product.image || '';
    setFormData({
      name: product.name || '',
      category: product.category || (categories.length > 0 ? categories[0].name : ''),
      description: product.description || '',
      image: imageUrl
    });
    // Set preview for editing
    setImagePreview(imageUrl);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
    } catch (error) {
      alert('Failed to delete product');
    }
  };

  const resetForm = () => {
    setFormData({ 
      name: '', 
      category: categories.length > 0 ? categories[0].name : '', 
      description: '', 
      image: '' 
    });
    setImagePreview(null);
    setEditingProduct(null);
    setShowForm(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold font-dinbek text-reshow-dark">Products</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-reshow-red text-white px-4 py-2 rounded-lg font-dosis font-semibold hover:bg-reshow-dark-red transition-colors"
        >
          {showForm ? 'Cancel' : 'Add Product'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg mb-6 space-y-4">
          <div>
            <label className="block font-dosis font-semibold mb-2">Product Name *</label>
            <input
              type="text"
              name="name"
              value={safeFormData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-reshow-red font-dosis"
            />
          </div>
          <div>
            <label className="block font-dosis font-semibold mb-2">Category *</label>
            <select
              name="category"
              value={safeFormData.category}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-reshow-red font-dosis"
            >
              {categories.length > 0 ? (
                categories.map(cat => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))
              ) : (
                <>
                  <option value="Apparel">Apparel</option>
                  <option value="Headwear">Headwear</option>
                  <option value="Promotional Gifts">Promotional Gifts</option>
                  <option value="PPE Wear">PPE Wear</option>
                </>
              )}
            </select>
          </div>
          <div>
            <label className="block font-dosis font-semibold mb-2">Description *</label>
            <textarea
              name="description"
              value={safeFormData.description}
              onChange={handleChange}
              required
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-reshow-red font-dosis"
            ></textarea>
          </div>
          <div>
            <label className="block font-dosis font-semibold mb-2">Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg font-dosis"
            />
            {uploading && <p className="text-sm font-dosis text-gray-600 mt-2">Uploading...</p>}
            {(imagePreview || safeFormData.image) && (
              <div className="mt-2">
                <img 
                  src={imagePreview || safeFormData.image} 
                  alt="Preview" 
                  className="w-48 h-48 object-cover rounded border border-gray-300"
                  onError={(e) => {
                    console.error('Image load error:', e.target.src);
                    e.target.src = '/images/placeholder.jpg';
                  }}
                />
                {safeFormData.image && (
                  <p className="text-xs font-dosis text-gray-500 mt-1">Image URL: {safeFormData.image}</p>
                )}
              </div>
            )}
          </div>
          <button
            type="submit"
            className="bg-reshow-red text-white px-6 py-2 rounded-lg font-dosis font-semibold hover:bg-reshow-dark-red transition-colors"
          >
            {editingProduct ? 'Update Product' : 'Add Product'}
          </button>
        </form>
      )}

      {loading ? (
        <div className="text-center py-12 font-dosis">Loading products...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-12 font-dosis text-gray-600">No products yet. Add your first product!</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <div key={product.id} className="border rounded-lg p-4 flex flex-col">
              <div className="relative w-full aspect-[4/3] bg-gray-100 rounded mb-4 overflow-hidden flex items-center justify-center">
                <img
                  src={product.image || '/images/placeholder.jpg'}
                  alt={product.name}
                  className="max-w-full max-h-full w-auto h-auto object-contain"
                  onError={(e) => {
                    e.target.src = '/images/placeholder.jpg';
                  }}
                />
              </div>
              <h3 className="text-lg font-bold font-dinbek mb-2">{product.name}</h3>
              <p className="text-sm font-dosis text-gray-600 mb-2">{product.category}</p>
              <p className="font-dosis text-gray-700 text-sm mb-4 line-clamp-2">{product.description}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(product)}
                  className="flex-1 bg-reshow-dark text-white py-2 rounded-lg font-dosis font-semibold hover:bg-gray-800 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="flex-1 bg-red-500 text-white py-2 rounded-lg font-dosis font-semibold hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminProducts;

