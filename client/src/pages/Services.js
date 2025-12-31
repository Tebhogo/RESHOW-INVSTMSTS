import React, { useState, useEffect } from 'react';
import api, { getImageUrl } from '../utils/api';
import StarRating from '../components/StarRating';

const Services = () => {
  const [products, setProducts] = useState([]);
  const [services, setServices] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedServiceCategory, setSelectedServiceCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [pageContent, setPageContent] = useState(null);
  const [ratingProduct, setRatingProduct] = useState(null);
  const [ratingService, setRatingService] = useState(null);
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [quoteFormData, setQuoteFormData] = useState({
    nameOrCompany: '',
    email: '',
    phone: ''
  });
  const [submittingQuote, setSubmittingQuote] = useState(false);

  const [categories, setCategories] = useState(['all', 'Apparel', 'Headwear', 'Promotional Gifts', 'PPE Wear']);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
    fetchServices();
    fetchPageContent();
  }, []);

  const fetchServices = async () => {
    setServicesLoading(true);
    try {
      const res = await api.get('/services-content/items');
      setServices(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error('Error fetching services:', error);
      setServices([]);
    } finally {
      setServicesLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      const cats = Array.isArray(res.data) ? res.data : [];
      if (cats.length > 0) {
        setCategories(['all', ...cats.map(c => c.name)]);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Keep default categories if API fails
    }
  };

  const fetchPageContent = async () => {
    try {
      // Try /content/services first (from admin content)
      let res = await api.get('/content/services').catch(() => null);
      
      // If that fails, try /services-content (from services route)
      if (!res || !res.data || Object.keys(res.data).length === 0) {
        res = await api.get('/services-content').catch(() => null);
      }
      
      if (res && res.data) {
        setPageContent(res.data);
      } else {
        setPageContent({
          title: 'Our Services',
          description: 'Comprehensive branding solutions for your organisation',
          image: ''
        });
      }
    } catch (error) {
      console.error('Error fetching services content:', error);
      setPageContent({
        title: 'Our Services',
        description: 'Comprehensive branding solutions for your organisation',
        image: ''
      });
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products');
      setProducts(Array.isArray(res.data) ? res.data : []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      if (error.code === 'ECONNREFUSED' || error.message?.includes('ERR_CONNECTION_REFUSED')) {
        console.error('Backend server is not running. Please start the server on port 5000.');
      }
      // Set empty array if server is not available
      setProducts([]);
      setLoading(false);
    }
  };

  const addToCart = (product) => {
    setCart([...cart, { ...product, quantity: 1 }]);
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(cart.map(item => 
      item.id === productId ? { ...item, quantity } : item
    ));
  };

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(p => p.category === selectedCategory);

  const filteredServices = selectedServiceCategory === 'all'
    ? services
    : services.filter(s => s.category === selectedServiceCategory);

  const handleProductRating = async (productId, rating) => {
    try {
      await api.post(`/products/${productId}/rate`, { rating });
      // Update local state
      setProducts(prevProducts => 
        prevProducts.map(p => 
          p.id === productId ? { ...p, rating } : p
        )
      );
      setRatingProduct(null);
      alert('Thank you for rating!');
    } catch (error) {
      console.error('Error rating product:', error);
      alert('Failed to submit rating. Please try again.');
    }
  };

  const handleServiceRating = async (serviceId, rating) => {
    try {
      await api.post(`/services-content/items/${serviceId}/rate`, { rating });
      // Update local state
      setServices(prevServices => 
        prevServices.map(s => 
          s.id === serviceId ? { ...s, rating } : s
        )
      );
      setRatingService(null);
      alert('Thank you for rating!');
    } catch (error) {
      console.error('Error rating service:', error);
      alert('Failed to submit rating. Please try again.');
    }
  };

  const handleQuoteFormChange = (e) => {
    setQuoteFormData({
      ...quoteFormData,
      [e.target.name]: e.target.value
    });
  };

  const handleRequestQuote = () => {
    if (cart.length === 0) {
      alert('Your cart is empty');
      return;
    }
    setShowQuoteForm(!showQuoteForm);
  };

  const handleSubmitQuote = async (e) => {
    e.preventDefault();
    
    if (!quoteFormData.nameOrCompany || !quoteFormData.email) {
      alert('Name/Company and Email are required');
      return;
    }

    setSubmittingQuote(true);
    try {
      await api.post('/quotes', {
        name: quoteFormData.nameOrCompany,
        email: quoteFormData.email,
        phone: quoteFormData.phone || '',
        company: quoteFormData.nameOrCompany,
        products: cart.map(item => ({
          productId: item.id,
          productName: item.name,
          quantity: item.quantity
        })),
        message: ''
      });

      alert('Quote request submitted successfully! We will contact you soon.');
      setCart([]);
      setShowQuoteForm(false);
      setQuoteFormData({
        nameOrCompany: '',
        email: '',
        phone: ''
      });
    } catch (error) {
      console.error('Error submitting quote:', error);
      alert('Failed to submit quote request. Please try again.');
    } finally {
      setSubmittingQuote(false);
    }
  };

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="bg-reshow-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className={`grid ${pageContent?.image ? 'md:grid-cols-2' : ''} gap-12 items-center`}>
            <div className="text-center md:text-left">
              <h1 className="text-5xl font-bold font-dinbek mb-6 text-reshow-dark">
                {pageContent?.title || 'Our Services'}
              </h1>
              <p className="text-lg font-dosis text-gray-700">
                {pageContent?.description || 'Comprehensive branding solutions for your organisation'}
              </p>
            </div>
            {pageContent?.image && (
              <div className="mt-8 md:mt-0">
                <img
                  src={getImageUrl(pageContent.image)}
                  alt={pageContent.title || 'Our Services'}
                  className="w-full h-auto rounded-lg shadow-lg object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Cart Sidebar */}
      {cart.length > 0 && (
        <div className="fixed right-0 top-20 bg-white shadow-lg p-6 w-80 max-h-[calc(100vh-5rem)] overflow-y-auto z-40 border-l border-gray-200">
          <div className="flex justify-between items-center mb-4 pb-3 border-b">
            <h3 className="text-xl font-bold font-dinbek">Cart ({cart.length})</h3>
            <button
              onClick={() => setCart([])}
              className="text-sm font-dosis text-gray-500 hover:text-red-500"
            >
              Clear All
            </button>
          </div>
          <div className="space-y-4 mb-4 max-h-[calc(100vh-15rem)] overflow-y-auto">
            {cart.map(item => (
              <div key={item.id} className="border rounded-lg p-3 bg-gray-50">
                <div className="flex gap-3 mb-2">
                  {item.image && (
                    <img
                      src={getImageUrl(item.image)}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                      onError={(e) => {
                        e.target.src = '/images/placeholder.jpg';
                      }}
                    />
                  )}
                  <div className="flex-1">
                    <p className="font-dosis font-semibold text-sm">{item.name}</p>
                    <p className="font-dosis text-xs text-gray-600">{item.category}</p>
                    {item.rating > 0 && (
                      <div className="mt-1">
                        <StarRating rating={item.rating} readonly={true} size="sm" />
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-700 text-xl font-bold h-6 w-6 flex items-center justify-center"
                    title="Remove from cart"
                  >
                    ×
                  </button>
                </div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-2 py-1 border rounded hover:bg-gray-200 font-dosis font-semibold"
                      disabled={item.quantity <= 1}
                    >
                      −
                    </button>
                    <span className="font-dosis font-semibold w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-2 py-1 border rounded hover:bg-gray-200 font-dosis font-semibold"
                    >
                      +
                    </button>
                  </div>
                  <span className="font-dosis font-semibold text-reshow-red">
                    Qty: {item.quantity}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t pt-4 mt-4">
            <div className="mb-3">
              <p className="font-dosis text-sm text-gray-600 mb-1">Total Items: {cart.reduce((sum, item) => sum + item.quantity, 0)}</p>
            </div>
            
            {/* Quote Request Form */}
            {showQuoteForm && (
              <form onSubmit={handleSubmitQuote} className="mb-4 space-y-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div>
                  <label className="block font-dosis font-semibold text-sm mb-1 text-gray-700">
                    Name or Company *
                  </label>
                  <input
                    type="text"
                    name="nameOrCompany"
                    value={quoteFormData.nameOrCompany}
                    onChange={handleQuoteFormChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-reshow-red focus:border-reshow-red font-dosis text-sm"
                    placeholder="Enter your name or company"
                  />
                </div>
                <div>
                  <label className="block font-dosis font-semibold text-sm mb-1 text-gray-700">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={quoteFormData.email}
                    onChange={handleQuoteFormChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-reshow-red focus:border-reshow-red font-dosis text-sm"
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <label className="block font-dosis font-semibold text-sm mb-1 text-gray-700">
                    Phone Number <span className="text-gray-500 font-normal">(optional)</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={quoteFormData.phone}
                    onChange={handleQuoteFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-reshow-red focus:border-reshow-red font-dosis text-sm"
                    placeholder="Enter your phone number"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    disabled={submittingQuote}
                    className="flex-1 bg-reshow-red text-white py-2 rounded-lg font-dosis font-semibold hover:bg-reshow-dark-red transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    {submittingQuote ? 'Sending...' : 'Send Quote Request'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowQuoteForm(false);
                      setQuoteFormData({
                        nameOrCompany: '',
                        email: '',
                        phone: ''
                      });
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg font-dosis font-semibold hover:bg-gray-100 transition-colors text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
            
            <button
              onClick={handleRequestQuote}
              className={`w-full bg-reshow-red text-white py-3 rounded-lg font-dosis font-semibold hover:bg-reshow-dark-red transition-colors shadow-md hover:shadow-lg ${showQuoteForm ? 'opacity-75' : ''}`}
            >
              {showQuoteForm ? 'Hide Form' : `Request Quote (${cart.length} ${cart.length === 1 ? 'item' : 'items'})`}
            </button>
          </div>
        </div>
      )}

      {/* Category Filter */}
      <section className="py-8 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap gap-4 justify-center">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2 rounded-lg font-dosis font-semibold transition-colors ${
                  selectedCategory === cat
                    ? 'bg-reshow-red text-white'
                    : 'bg-white text-reshow-dark hover:bg-gray-100'
                }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      {services.length > 0 && (
        <section className="py-16 px-4 bg-reshow-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold font-dinbek text-reshow-dark mb-8 text-center">Our Services</h2>
            
            {/* Service Category Filter */}
            <div className="mb-8 flex flex-wrap gap-4 justify-center">
              <button
                onClick={() => setSelectedServiceCategory('all')}
                className={`px-6 py-2 rounded-lg font-dosis font-semibold transition-colors ${
                  selectedServiceCategory === 'all'
                    ? 'bg-reshow-red text-white'
                    : 'bg-white text-reshow-dark hover:bg-gray-100 border border-gray-300'
                }`}
              >
                All Services
              </button>
              {categories.filter(cat => cat !== 'all').map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedServiceCategory(cat)}
                  className={`px-6 py-2 rounded-lg font-dosis font-semibold transition-colors ${
                    selectedServiceCategory === cat
                      ? 'bg-reshow-red text-white'
                      : 'bg-white text-reshow-dark hover:bg-gray-100 border border-gray-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {servicesLoading ? (
              <div className="text-center py-12">
                <p className="font-dosis text-gray-700">Loading services...</p>
              </div>
            ) : filteredServices.length === 0 ? (
              <div className="text-center py-12">
                <p className="font-dosis text-gray-700">No services found in this category.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-8">
                {filteredServices.map(service => (
                <div key={service.id} className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
                  <div className="relative w-full aspect-[4/3] bg-gray-100 overflow-hidden flex items-center justify-center">
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
                    <div className="p-6">
                      {service.category && (
                        <span className="text-xs font-dosis text-reshow-red bg-red-50 px-2 py-1 rounded uppercase mb-2 inline-block">{service.category}</span>
                      )}
                      <h3 className="text-xl font-bold font-dinbek mt-2 mb-2 text-reshow-dark">{service.title}</h3>
                      <div className="mb-2">
                        {ratingService === service.id ? (
                          <StarRating 
                            rating={service.rating || 0} 
                            onRatingChange={(rating) => handleServiceRating(service.id, rating)}
                            readonly={false} 
                            size="sm" 
                          />
                        ) : (
                          <div className="flex items-center gap-2">
                            <StarRating rating={service.rating || 0} readonly={true} size="sm" />
                            <button
                              onClick={() => setRatingService(service.id)}
                              className="text-xs font-dosis text-reshow-red hover:underline"
                            >
                              Rate
                            </button>
                          </div>
                        )}
                      </div>
                      <p className="font-dosis text-gray-700 mb-4">{service.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Products Grid */}
      <section className="py-16 px-4 bg-reshow-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold font-dinbek text-reshow-dark mb-8 text-center">Our Products</h2>
          {loading ? (
            <div className="text-center py-12">
              <p className="font-dosis text-gray-700">Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="font-dosis text-gray-700">No products available.</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="font-dosis text-gray-700">No products found in this category.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {filteredProducts.map(product => (
                <div key={product.id} className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
                  <div className="relative w-full aspect-[4/3] bg-gray-100 overflow-hidden flex items-center justify-center">
                    <img
                      src={getImageUrl(product.image)}
                      alt={product.name}
                      className="max-w-full max-h-full w-auto h-auto object-contain"
                      onError={(e) => {
                        e.target.src = '/images/placeholder.jpg';
                      }}
                    />
                  </div>
                  <div className="p-6">
                    <span className="text-xs font-dosis text-gray-500 uppercase">{product.category}</span>
                    <h3 className="text-xl font-bold font-dinbek mt-2 mb-2 text-reshow-dark">{product.name}</h3>
                    <div className="mb-2">
                      {ratingProduct === product.id ? (
                        <StarRating 
                          rating={product.rating || 0} 
                          onRatingChange={(rating) => handleProductRating(product.id, rating)}
                          readonly={false} 
                          size="sm" 
                        />
                      ) : (
                        <div className="flex items-center gap-2">
                          <StarRating rating={product.rating || 0} readonly={true} size="sm" />
                          <button
                            onClick={() => setRatingProduct(product.id)}
                            className="text-xs font-dosis text-reshow-red hover:underline"
                          >
                            Rate
                          </button>
                        </div>
                      )}
                    </div>
                    <p className="font-dosis text-gray-700 mb-4">{product.description}</p>
                    <button
                      onClick={() => addToCart(product)}
                      className="w-full bg-reshow-dark text-white py-2 rounded-lg font-dosis font-semibold hover:bg-gray-800 transition-colors"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Services;

