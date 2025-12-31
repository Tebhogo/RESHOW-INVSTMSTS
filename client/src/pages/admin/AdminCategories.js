import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await api.get('/categories');
      setCategories(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!categoryName.trim()) {
      alert('Category name is required');
      return;
    }

    setSaving(true);
    try {
      await api.post('/categories', { name: categoryName.trim() });
      setCategoryName('');
      setShowForm(false);
      fetchCategories();
    } catch (error) {
      console.error('Error creating category:', error);
      alert(error.response?.data?.error || 'Failed to create category');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete the category "${name}"?\n\nNote: You cannot delete a category if products are using it.`)) {
      return;
    }

    try {
      await api.delete(`/categories/${id}`);
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      alert(error.response?.data?.error || 'Failed to delete category');
    }
  };

  const resetForm = () => {
    setCategoryName('');
    setShowForm(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold font-dinbek text-reshow-dark">Product Categories</h2>
        <button
          onClick={() => {
            if (showForm) {
              resetForm();
            } else {
              setShowForm(true);
            }
          }}
          className="bg-reshow-red text-white px-4 py-2 rounded-lg font-dosis font-semibold hover:bg-reshow-dark-red transition-colors"
        >
          {showForm ? 'Cancel' : '+ Add Category'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg mb-6 space-y-4">
          <div>
            <label className="block font-dosis font-semibold mb-2">Category Name *</label>
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              required
              placeholder="e.g., Accessories, Footwear, etc."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-reshow-red font-dosis"
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="bg-reshow-red text-white px-6 py-2 rounded-lg font-dosis font-semibold hover:bg-reshow-dark-red transition-colors disabled:opacity-50"
          >
            {saving ? 'Adding...' : 'Add Category'}
          </button>
        </form>
      )}

      {loading ? (
        <div className="text-center py-12 font-dosis">Loading categories...</div>
      ) : categories.length === 0 ? (
        <div className="text-center py-12 font-dosis text-gray-600 bg-white p-6 rounded-lg border border-gray-200">
          No categories yet. Click "Add Category" to create your first category!
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map(category => (
            <div key={category.id} className="border rounded-lg p-4 bg-white">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold font-dinbek text-reshow-dark">{category.name}</h3>
                  <p className="text-sm font-dosis text-gray-500 mt-1">
                    Created: {new Date(category.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(category.id, category.name)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg font-dosis font-semibold hover:bg-red-600 transition-colors text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="font-dosis text-sm text-gray-700">
          <strong>Note:</strong> You cannot delete a category if there are products assigned to it. 
          Please reassign or delete those products first.
        </p>
      </div>
    </div>
  );
};

export default AdminCategories;

