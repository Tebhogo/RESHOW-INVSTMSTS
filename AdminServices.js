import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import ImageUpload from '../../components/ImageUpload';
import StarRating from '../../components/StarRating';
import { getImageUrl } from '../../utils/api';

const AdminServices = () => {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    category: '',
    rating: 0
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchServices();
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
      setCategories([]);
    }
  };

  const fetchServices = async () => {
    try {
      const res = await api.get('/services-content/items');
      setServices(Array.isArray(res.data) ? res.data : []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching services:', error);
      setServices([]);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (imageUrl) => {
    setFormData({
      ...formData,
      image: imageUrl
    });
  };

  const handleRatingChange = (rating) => {
    setFormData({
      ...formData,
      rating: rating
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const dataToSubmit = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        image: formData.image || '',
        category: formData.category || '',
        rating: formData.rating || 0
      };
      
      if (editingService) {
        await api.put(`/services-content/items/${editingService.id}`, dataToSubmit);
      } else {
        await api.post('/services-content/items', dataToSubmit);
      }
      fetchServices();
      resetForm();
    } catch (error) {
      console.error('Error saving service:', error);
      alert(error.response?.data?.error || 'Failed to save service');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({
      title: service.title || '',
      description: service.description || '',
      image: service.image || '',
      category: service.category || (categories.length > 0 ? categories[0].name : ''),
      rating: service.rating || 0
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;

    try {
      await api.delete(`/services-content/items/${id}`);
      fetchServices();
    } catch (error) {
      alert('Failed to delete service');
    }
  };

  const resetForm = () => {
    setFormData({ 
      title: '', 
      description: '', 
      image: '', 
      category: categories.length > 0 ? categories[0].name : '',
      rating: 0
    });
    setEditingService(null);
    setShowForm(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold font-dinbek text-reshow-dark">Services</h2>
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
          {showForm ? 'Cancel' : '+ Add Service'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg mb-6 space-y-4">
          <div>
            <label className="block font-dosis font-semibold mb-2">Service Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-reshow-red font-dosis"
            />
          </div>
          <div>
            <label className="block font-dosis font-semibold mb-2">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-reshow-red font-dosis"
            ></textarea>
          </div>
          <div>
            <label className="block font-dosis font-semibold mb-2">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-reshow-red font-dosis"
            >
              <option value="">No Category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-dosis font-semibold mb-2">Rating</label>
            <StarRating
              rating={formData.rating}
              onRatingChange={handleRatingChange}
              readonly={false}
            />
          </div>
          <div>
            <ImageUpload
              label="Service Image"
              currentImage={formData.image}
              onImageChange={handleImageChange}
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="bg-reshow-red text-white px-6 py-2 rounded-lg font-dosis font-semibold hover:bg-reshow-dark-red transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : editingService ? 'Update Service' : 'Add Service'}
          </button>
        </form>
      )}

      {loading ? (
        <div className="text-center py-12 font-dosis">Loading services...</div>
      ) : services.length === 0 ? (
        <div className="text-center py-12 font-dosis text-gray-600">
          No services yet. Click "Add Service" to add your first service!
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map(service => (
            <div key={service.id} className="border rounded-lg p-4 bg-white flex flex-col">
              <div className="relative w-full aspect-[4/3] bg-gray-100 rounded mb-4 overflow-hidden flex items-center justify-center">
                {service.image ? (
                  <img
                    src={getImageUrl(service.image)}
                    alt={service.title}
                    className="max-w-full max-h-full w-auto h-auto object-contain"
                    onError={(e) => {
                      e.target.src = '/images/placeholder.jpg';
                    }}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-dosis">No Image</div>
                )}
              </div>
              <h3 className="text-lg font-bold font-dinbek mb-2 text-reshow-dark">{service.title}</h3>
              {service.category && (
                <span className="inline-block text-xs font-dosis text-reshow-red bg-red-50 px-2 py-1 rounded mb-2">
                  {service.category}
                </span>
              )}
              <div className="mb-2">
                <StarRating rating={service.rating || 0} readonly={true} size="sm" />
              </div>
              <p className="font-dosis text-gray-700 text-sm mb-4 line-clamp-3">{service.description}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(service)}
                  className="flex-1 bg-reshow-dark text-white py-2 rounded-lg font-dosis font-semibold hover:bg-gray-800 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(service.id)}
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

export default AdminServices;

