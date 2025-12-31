import React, { useState, useEffect, useContext } from 'react';
import api, { getImageUrl } from '../../utils/api';
import { AuthContext } from '../../context/AuthContext';
import ImageUpload from '../../components/ImageUpload';
import StarRating from '../../components/StarRating';

const AdminContent = () => {
  const [sections, setSections] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  
  // Services list management state
  const [services, setServices] = useState([]);
  const [serviceCategories, setServiceCategories] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [serviceFormData, setServiceFormData] = useState({
    title: '',
    description: '',
    image: '',
    category: ''
  });

  // Products list management state
  const [products, setProducts] = useState([]);
  const [productCategories, setProductCategories] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productFormData, setProductFormData] = useState({
    name: '',
    category: '',
    description: '',
    image: '',
    rating: 0
  });

  // Define all editable sections - Organized by page order (matching navbar)
  const sectionDefinitions = [
    // ========== HOME PAGE SECTIONS ==========
    { id: 'hero', name: 'Hero Section (Home)', fields: ['title', 'subtitle', 'description', 'image', 'buttonText'] },
    { id: 'whyChoose', name: 'Why Choose Reshow Section (Home)', fields: ['title', 'image'], isList: true, listField: 'benefits' },
    { id: 'productCategories', name: 'Product Categories Section (Home)', fields: ['title', 'subtitle', 'description', 'buttonText'], isList: true, listField: 'categories' },
    { id: 'productShowcase', name: 'Product Showcase Section (Home)', fields: ['title', 'description'], isList: true, listField: 'products' },
    { id: 'companyLogos', name: 'Company Logos Section (Home)', fields: ['title'], isList: true, listField: 'logos' },
    // ========== ABOUT PAGE ==========
    { id: 'aboutHero', name: 'About Hero Section (About Page)', fields: ['title', 'description', 'description2', 'image'] },
    { id: 'aboutStats', name: 'About Stats Section (About Page)', fields: ['years', 'yearsLabel', 'clients', 'clientsLabel', 'projects', 'projectsLabel'] },
    { id: 'mission', name: 'Mission Section (About Page)', fields: ['title', 'content'] },
    { id: 'vision', name: 'Vision Section (About Page)', fields: ['title', 'content'] },
    { id: 'values', name: 'Values Section (About Page)', fields: [], isList: true, listField: 'values' },
    { id: 'partnership', name: 'Partnership Section (About Page)', fields: ['title', 'partnerName', 'description1', 'description2', 'image'] },
    { id: 'experience', name: 'Experience Section (About Page)', fields: ['title', 'description'], isList: true, listField: 'clients', hasImages: true, imagesField: 'images' },
    // ========== SERVICES PAGE ==========
    { id: 'services', name: 'Services Section (Services Page)', fields: ['title', 'description', 'image'] },
    // ========== GALLERY PAGE ==========
    { id: 'gallery', name: 'Gallery Section (Gallery Page)', fields: ['title', 'description'], isList: true, listField: 'images' },
    // ========== CONTACT PAGE ==========
    { id: 'contact', name: 'Contact Section (Contact Page)', fields: ['title', 'description', 'address', 'phone', 'phone2', 'email'] },
    // ========== FOOTER (All Pages) ==========
    { id: 'footer', name: 'Footer (All Pages)', fields: ['companyName', 'tagline', 'address', 'phone1', 'phone2', 'email', 'facebook', 'instagram', 'twitter', 'tiktok'] },
    // ========== NAVBAR SETTINGS ==========
    { id: 'navbar', name: 'Navbar Settings (All Pages)', fields: ['logoImage', 'logoDisplay'] },
  ];

  useEffect(() => {
    fetchContent();
    fetchServiceCategories();
    fetchServices();
    fetchProductCategories();
    fetchProducts();
  }, []);

  const fetchServiceCategories = async () => {
    try {
      const res = await api.get('/categories');
      const cats = Array.isArray(res.data) ? res.data : [];
      setServiceCategories(cats);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setServiceCategories([]);
    }
  };

  const fetchProductCategories = async () => {
    try {
      const res = await api.get('/categories');
      const cats = Array.isArray(res.data) ? res.data : [];
      setProductCategories(cats);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setProductCategories([]);
    }
  };

  const fetchProducts = async () => {
    setProductsLoading(true);
    try {
      const res = await api.get('/products');
      setProducts(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setProductsLoading(false);
    }
  };

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

  const fetchContent = async () => {
    try {
      // Fetch from admin/content (saved content)
      const savedContentRes = await api.get('/admin/content').catch(() => ({ data: {} }));
      const savedContent = savedContentRes.data || {};

      // Fetch existing content from actual pages
      const [heroRes, aboutRes, servicesRes] = await Promise.all([
        api.get('/content/hero').catch(() => ({ data: null })),
        api.get('/about').catch(() => ({ data: null })),
        api.get('/services-content').catch(() => ({ data: null }))
      ]);

      const aboutData = aboutRes.data || {};

      // Merge existing content with saved content (saved content takes priority)
      const mergedContent = {
        // Hero Section - from Content API
        hero: {
          title: heroRes.data?.title || 'Reshow Investments (Pvt) Ltd',
          subtitle: heroRes.data?.subtitle || 'Name it we brand it.',
          description: heroRes.data?.description || 'Trusted Zimbabwean company specialising in corporate branding, promotional gifts, corporate apparel, and branding solutions.',
          image: heroRes.data?.image || '/images/placeholder/hero-image.jpg',
          buttonText: heroRes.data?.buttonText || 'Request Quote',
          ...savedContent.hero
        },
        // Why Choose Reshow Section
        whyChoose: {
          title: 'Why Choose Reshow',
          image: '/images/placeholder/why-choose.jpg',
          benefits: [
            'Over a decade of industry experience',
            'International quality through BARRON partnership',
            'Customised branding solutions',
            'Reliable turnaround times',
            'Professional and customer-focused service'
          ],
          ...savedContent.whyChoose
        },
        // Product Categories Section
        productCategories: {
          title: 'Explore Our Product Categories',
          subtitle: 'Products',
          description: 'Discover our comprehensive range of corporate branding solutions, promotional products, and professional apparel tailored to your needs.',
          buttonText: 'View Products',
          categories: [
            { id: 1, title: 'Corporate Apparel', description: 'Professional workwear and corporate clothing solutions', image: '/images/placeholder/apparel.jpg' },
            { id: 2, title: 'Promotional Gifts', description: 'Custom branded gifts and promotional items', image: '/images/placeholder/gifts.jpg' },
            { id: 3, title: 'Top Sellers', description: 'Our most popular branding solutions', image: '/images/placeholder/topsellers.jpg' },
            { id: 4, title: 'PPE Wear', description: 'Personal protective equipment and safety gear', image: '/images/placeholder/ppe.jpg' },
            { id: 5, title: 'Headwear', description: 'Branded caps, hats, and headwear solutions', image: '/images/placeholder/headwear.jpg' }
          ],
          ...savedContent.productCategories
        },
        // Company Logos Section
        companyLogos: {
          title: 'Trusted by Companies We\'ve Worked With',
          logos: [
            { id: 1, name: 'Company 1', image: '/images/placeholder/logo1.png' },
            { id: 2, name: 'Company 2', image: '/images/placeholder/logo2.png' },
            { id: 3, name: 'Company 3', image: '/images/placeholder/logo3.png' },
            { id: 4, name: 'Company 4', image: '/images/placeholder/logo4.png' },
            { id: 5, name: 'Company 5', image: '/images/placeholder/logo5.png' },
          ],
          ...savedContent.companyLogos
        },
        // Product Showcase Section
        productShowcase: {
          title: 'Our Branding Solutions',
          description: 'A snapshot of our corporate branding, apparel, promotional gifts, and professional workwear solutions.',
          products: [
            { id: 1, title: 'Workwear & PPE', image: '/images/placeholder/workwear.jpg' },
            { id: 2, title: 'Corporate Apparel', image: '/images/placeholder/apparel.jpg' },
            { id: 3, title: 'Branded Mugs', image: '/images/placeholder/mug.jpg' },
            { id: 4, title: 'Promotional Bottles', image: '/images/placeholder/bottle.jpg' },
            { id: 5, title: 'Gift Packaging', image: '/images/placeholder/packaging.jpg' },
            { id: 6, title: 'Corporate Headwear', image: '/images/placeholder/cap.jpg' }
          ],
          ...savedContent.productShowcase
        },
        // About Hero Section - from About page API
        aboutHero: {
          title: aboutData?.hero?.title || 'About Reshow Investments',
          description: aboutData?.hero?.description || 'At Reshow Investments, we believe in the power of branding. With years of experience in corporate branding, promotional gifts, and corporate apparel, we help businesses make a lasting impression.',
          description2: aboutData?.hero?.description2 || '',
          image: aboutData?.hero?.image || '/images/placeholder/about-company.jpg',
          ...savedContent.aboutHero
        },
        // About Stats Section
        aboutStats: {
          years: aboutData?.stats?.years || '10+',
          yearsLabel: aboutData?.stats?.yearsLabel || 'Years of Experience',
          clients: aboutData?.stats?.clients || '500+',
          clientsLabel: aboutData?.stats?.clientsLabel || 'Happy Clients',
          projects: aboutData?.stats?.projects || '1000+',
          projectsLabel: aboutData?.stats?.projectsLabel || 'Projects Completed',
          ...savedContent.aboutStats
        },
        // Mission Section
        mission: {
          title: aboutData?.mission?.title || 'Our Mission',
          content: aboutData?.mission?.content || '',
          ...savedContent.mission
        },
        // Vision Section
        vision: {
          title: aboutData?.vision?.title || 'Our Vision',
          content: aboutData?.vision?.content || '',
          ...savedContent.vision
        },
        // Values Section
        values: {
          values: aboutData?.values || [
            { title: 'Efficiency', description: 'Timely turnaround without compromising quality' },
            { title: 'Integrity', description: 'Transparent operations and honest engagement' },
            { title: 'Flexibility', description: 'Tailored solutions that adapt to client needs' }
          ],
          ...savedContent.values
        },
        // Partnership Section
        partnership: {
          title: aboutData?.partnership?.title || 'Strategic Partnerships',
          partnerName: aboutData?.partnership?.partnerName || 'BARRON South Africa',
          description1: aboutData?.partnership?.description1 || '',
          description2: aboutData?.partnership?.description2 || '',
          image: aboutData?.partnership?.image || '/images/placeholder/barron-partnership.jpg',
          ...savedContent.partnership
        },
        // Experience Section
        experience: {
          title: aboutData?.experience?.title || 'Our Experience',
          description: aboutData?.experience?.description || 'With over 10 years of experience, we serve clients across:',
          clients: aboutData?.experience?.clients || [
            'Financial institutions',
            'Government and municipalities',
            'Manufacturing and industrial sectors'
          ],
          ...savedContent.experience
        },
        // Services Section - from Services API
        services: {
          title: servicesRes.data?.title || 'Our Services',
          description: servicesRes.data?.description || '',
          image: '',
          ...savedContent.services
        },
        // Gallery Section
        gallery: {
          title: 'Gallery',
          description: 'View our portfolio of branding solutions and products.',
          images: [
            { id: 1, name: 'Gallery Image 1', image: '/images/placeholder.jpg', alt: 'Gallery Image 1' },
            { id: 2, name: 'Gallery Image 2', image: '/images/placeholder.jpg', alt: 'Gallery Image 2' },
            { id: 3, name: 'Gallery Image 3', image: '/images/placeholder.jpg', alt: 'Gallery Image 3' },
          ],
          ...savedContent.gallery
        },
        // Contact Section
        contact: {
          title: 'Contact Us',
          description: 'Get in touch with us for your branding needs.',
          address: '55 Cnr Herbert Chitepo & Rekai Tangwena, Belvedere, Harare, Zimbabwe',
          phone: '+263 779 363 766',
          phone2: '+263 772 780 083',
          email: 'sales@reshow.co.zw',
          ...savedContent.contact
        },
        // Navbar Settings
        navbar: {
          logoImage: '',
          logoDisplay: 'text', // 'text', 'logo', or 'both'
          ...savedContent.navbar
        },
        // Footer Section - from Footer component (hardcoded)
        footer: {
          companyName: 'Reshow Investments',
          tagline: 'Name it we brand it.',
          address: '55 Cnr Herbert Chitepo & Rekai Tangwena, Belvedere, Harare, Zimbabwe',
          phone1: '+263 779 363 766',
          phone2: '+263 772 780 083',
          email: 'sales@reshow.co.zw',
          facebook: 'https://facebook.com',
          instagram: 'https://instagram.com',
          twitter: 'https://twitter.com',
          tiktok: 'https://tiktok.com',
          ...savedContent.footer
        }
      };

      setSections(mergedContent);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching content:', error);
      // Set default content if fetch fails
      setSections({
        hero: { title: '', subtitle: '', description: '', image: '', buttonText: '' },
        companyLogos: { title: '', logos: [] },
        whyChoose: { title: '', image: '', benefits: [] },
        productCategories: { title: '', subtitle: '', description: '', buttonText: '', categories: [] },
        productShowcase: { title: '', description: '', products: [] },
        aboutHero: { title: '', description: '', description2: '', image: '' },
        aboutStats: { years: '', yearsLabel: '', clients: '', clientsLabel: '', projects: '', projectsLabel: '' },
        mission: { title: '', content: '' },
        vision: { title: '', content: '' },
        values: { values: [] },
        partnership: { title: '', partnerName: '', description1: '', description2: '', image: '' },
        experience: { title: '', description: '', clients: [], images: [] },
        services: { title: '', description: '', image: '' },
        gallery: { title: '', description: '', images: [] },
        contact: { title: '', description: '', address: '', phone: '', phone2: '', email: '' },
        navbar: { logoImage: '', logoDisplay: 'text' },
        footer: { companyName: '', tagline: '', address: '', phone1: '', phone2: '', email: '', facebook: '', instagram: '', twitter: '', tiktok: '' }
      });
      setLoading(false);
    }
  };

  const handleFieldChange = (sectionId, field, value) => {
    setSections(prev => {
      const currentSection = prev[sectionId] || {};
      const updatedSection = {
        ...currentSection,
        [field]: value
      };
      console.log('Updating section:', sectionId, 'field:', field, 'value:', value);
      console.log('Updated section:', updatedSection);
      return {
        ...prev,
        [sectionId]: updatedSection
      };
    });
  };

  const handleImageChange = (sectionId, imageUrl) => {
    handleFieldChange(sectionId, 'image', imageUrl);
  };

  const handleSave = async (sectionId) => {
    setSaving(true);
    try {
      // If saving an About page section, save all About sections together to /about endpoint
      if (['aboutHero', 'aboutStats', 'mission', 'vision', 'values', 'partnership', 'experience'].includes(sectionId)) {
        const aboutContent = {
          hero: {
            title: sections.aboutHero?.title || '',
            description: sections.aboutHero?.description || '',
            description2: sections.aboutHero?.description2 || '',
            image: sections.aboutHero?.image || ''
          },
          stats: {
            years: sections.aboutStats?.years || '',
            yearsLabel: sections.aboutStats?.yearsLabel || '',
            clients: sections.aboutStats?.clients || '',
            clientsLabel: sections.aboutStats?.clientsLabel || '',
            projects: sections.aboutStats?.projects || '',
            projectsLabel: sections.aboutStats?.projectsLabel || ''
          },
          mission: sections.mission || {},
          vision: sections.vision || {},
          values: sections.values?.values || [],
          partnership: {
            title: sections.partnership?.title || '',
            partnerName: sections.partnership?.partnerName || '',
            description1: sections.partnership?.description1 || '',
            description2: sections.partnership?.description2 || '',
            image: sections.partnership?.image || ''
          },
          experience: {
            title: sections.experience?.title || '',
            description: sections.experience?.description || '',
            clients: sections.experience?.clients || [],
            images: sections.experience?.images || []
          }
        };
        await api.put('/about', aboutContent);
      } else {
        await api.put(`/admin/content/${sectionId}`, sections[sectionId] || {});
      }
      alert('Content saved successfully!');
    } catch (error) {
      console.error('Error saving content:', error);
      alert(error.response?.data?.error || 'Failed to save content');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      // Save all sections except About page sections (they'll be saved separately)
      const sectionsToSave = { ...sections };
      const aboutSections = ['aboutHero', 'aboutStats', 'mission', 'vision', 'values', 'partnership', 'experience'];
      aboutSections.forEach(key => delete sectionsToSave[key]);
      
      await api.put('/admin/content', sectionsToSave);
      
      // Save About page sections together
      const aboutContent = {
        hero: {
          title: sections.aboutHero?.title || '',
          description: sections.aboutHero?.description || '',
          description2: sections.aboutHero?.description2 || ''
        },
        stats: {
          years: sections.aboutStats?.years || '',
          yearsLabel: sections.aboutStats?.yearsLabel || '',
          clients: sections.aboutStats?.clients || '',
          clientsLabel: sections.aboutStats?.clientsLabel || '',
          projects: sections.aboutStats?.projects || '',
          projectsLabel: sections.aboutStats?.projectsLabel || ''
        },
        mission: sections.mission || {},
        vision: sections.vision || {},
        values: sections.values?.values || [],
        partnership: sections.partnership || {},
        experience: {
          title: sections.experience?.title || '',
          description: sections.experience?.description || '',
          clients: sections.experience?.clients || [],
          images: sections.experience?.images || []
        }
      };
      await api.put('/about', aboutContent);
      
      alert('All content saved successfully!');
    } catch (error) {
      console.error('Error saving content:', error);
      alert(error.response?.data?.error || 'Failed to save content');
    } finally {
      setSaving(false);
    }
  };

  // Services list management functions
  const handleServiceChange = (e) => {
    setServiceFormData({
      ...serviceFormData,
      [e.target.name]: e.target.value
    });
  };

  const handleServiceImageChange = (imageUrl) => {
    setServiceFormData({
      ...serviceFormData,
      image: imageUrl
    });
  };

  const handleServiceRatingChange = (rating) => {
    setServiceFormData({
      ...serviceFormData,
      rating: rating
    });
  };

  const handleServiceSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const dataToSubmit = {
        title: serviceFormData.title.trim(),
        description: serviceFormData.description.trim(),
        image: serviceFormData.image || '',
        category: serviceFormData.category || '',
        rating: serviceFormData.rating || 0
      };
      
      if (editingService) {
        await api.put(`/services-content/items/${editingService.id}`, dataToSubmit);
      } else {
        await api.post('/services-content/items', dataToSubmit);
      }
      fetchServices();
      resetServiceForm();
    } catch (error) {
      console.error('Error saving service:', error);
      alert(error.response?.data?.error || 'Failed to save service');
    } finally {
      setSaving(false);
    }
  };

  const handleServiceEdit = (service) => {
    setEditingService(service);
    setServiceFormData({
      title: service.title || '',
      description: service.description || '',
      image: service.image || '',
      category: service.category || '',
      rating: service.rating || 0
    });
    setShowServiceForm(true);
  };

  const handleServiceDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;

    try {
      await api.delete(`/services-content/items/${id}`);
      fetchServices();
    } catch (error) {
      alert('Failed to delete service');
    }
  };

  const resetServiceForm = () => {
    setServiceFormData({ 
      title: '', 
      description: '', 
      image: '', 
      category: serviceCategories.length > 0 ? serviceCategories[0].name : '',
      rating: 0
    });
    setEditingService(null);
    setShowServiceForm(false);
  };

  // Products list management functions
  const handleProductChange = (e) => {
    setProductFormData({
      ...productFormData,
      [e.target.name]: e.target.value
    });
  };

  const handleProductImageChange = (imageUrl) => {
    setProductFormData({
      ...productFormData,
      image: imageUrl
    });
  };

  const handleProductRatingChange = (rating) => {
    setProductFormData({
      ...productFormData,
      rating: rating
    });
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const dataToSubmit = {
        name: productFormData.name.trim(),
        category: productFormData.category || '',
        description: productFormData.description.trim(),
        image: productFormData.image || '',
        rating: productFormData.rating || 0
      };
      
      if (editingProduct) {
        await api.put(`/products/${editingProduct.id}`, dataToSubmit);
      } else {
        await api.post('/products', dataToSubmit);
      }
      fetchProducts();
      resetProductForm();
    } catch (error) {
      console.error('Error saving product:', error);
      alert(error.response?.data?.error || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const handleProductEdit = (product) => {
    setEditingProduct(product);
    setProductFormData({
      name: product.name || '',
      category: product.category || '',
      description: product.description || '',
      image: product.image || '',
      rating: product.rating || 0
    });
    setShowProductForm(true);
  };

  const handleProductDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
    } catch (error) {
      alert('Failed to delete product');
    }
  };

  const resetProductForm = () => {
    setProductFormData({ 
      name: '', 
      category: productCategories.length > 0 ? productCategories[0].name : '', 
      description: '', 
      image: '',
      rating: 0
    });
    setEditingProduct(null);
    setShowProductForm(false);
  };

  if (loading) {
    return <div className="text-center py-12 font-dosis">Loading content...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold font-dinbek text-reshow-dark">Content Management</h2>
        <div className="flex gap-2">
          {activeSection && (
            <button
              onClick={() => handleSave(activeSection)}
              disabled={saving}
              className="bg-reshow-red text-white px-4 py-2 rounded-lg font-dosis font-semibold hover:bg-reshow-dark-red transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Section'}
            </button>
          )}
          <button
            onClick={handleSaveAll}
            disabled={saving}
            className="bg-reshow-dark text-white px-4 py-2 rounded-lg font-dosis font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save All'}
          </button>
        </div>
      </div>

      <div className="space-y-8">
        {/* Render Section Component */}
        {(() => {
          const renderSection = (sectionDef) => {
            const section = sections[sectionDef.id] || {};
            const isActive = activeSection === sectionDef.id;

            return (
              <div key={sectionDef.id} className="border rounded-lg p-6 bg-gray-50">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold font-dinbek text-reshow-dark">{sectionDef.name.replace(/ \(.*?\)/g, '')}</h3>
                  <button
                    onClick={() => setActiveSection(isActive ? null : sectionDef.id)}
                    className="text-reshow-red hover:text-reshow-dark-red font-dosis font-semibold"
                  >
                    {isActive ? 'Collapse' : 'Edit'}
                  </button>
                </div>

              {/* Show current content preview when collapsed */}
              {!isActive && (
                <div className="mt-4 p-4 bg-white rounded border border-gray-200">
                  <p className="text-sm font-dosis text-gray-600 mb-2">Current Content:</p>
                  <div className="space-y-1 text-sm font-dosis">
                    {/* Show all fields */}
                    {sectionDef.fields.map(field => {
                      if (field === 'image' || field === 'logoImage') {
                        const imgUrl = section[field] || section.image || '';
                        if (!imgUrl) return null;
                        return (
                          <div key={field} className="flex items-center gap-2">
                            <span className="font-semibold">{field === 'logoImage' ? 'Logo:' : 'Image:'}</span>
                            <span className="text-gray-500 truncate">{imgUrl}</span>
                          </div>
                        );
                      }
                      if (field === 'logoDisplay') {
                        const displayText = section[field] === 'text' ? 'Text Only' : section[field] === 'logo' ? 'Logo Only' : section[field] === 'both' ? 'Logo and Text' : 'Text Only';
                        return (
                          <div key={field} className="flex items-center gap-2">
                            <span className="font-semibold">Logo Display:</span>
                            <span className="text-gray-700">{displayText}</span>
                          </div>
                        );
                      }
                      const value = section[field];
                      if (value === null || value === undefined || value === '') return null;
                      const fieldLabel = field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1');
                      return (
                        <div key={field} className="flex items-start gap-2">
                          <span className="font-semibold min-w-[100px]">{fieldLabel}:</span>
                          <span className="text-gray-700 flex-1">{typeof value === 'string' && value.length > 100 ? `${value.substring(0, 100)}...` : value}</span>
                        </div>
                      );
                    })}
                    {/* Show list fields if they exist */}
                    {sectionDef.isList && sectionDef.listField && (
                      <div className="mt-2 pt-2 border-t">
                        <span className="font-semibold">
                          {sectionDef.listField === 'benefits' ? 'Benefits' : 
                           sectionDef.listField === 'categories' ? 'Categories' : 
                           sectionDef.listField === 'logos' ? 'Logos' :
                           sectionDef.listField === 'images' ? 'Images' :
                           sectionDef.listField === 'values' ? 'Values' :
                           sectionDef.listField === 'clients' ? 'Clients' :
                           'Products'}: 
                        </span>
                        <span className="text-gray-700 ml-2">
                          {(section[sectionDef.listField] || []).length} item(s)
                        </span>
                      </div>
                    )}
                    {Object.keys(section).filter(key => section[key] !== null && section[key] !== undefined && section[key] !== '').length === 0 && (
                      <p className="text-gray-400 italic">No content set yet</p>
                    )}
                  </div>
                </div>
              )}

              {isActive && (
                <div className="space-y-4 mt-4">
                  {sectionDef.fields.map(field => {
                    if (field === 'image' || field === 'logoImage') {
                      // Get full URL if it's a relative path
                      let imageUrl = section[field] || section.image || '';
                      if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('/images')) {
                        const apiBaseUrl = api.defaults.baseURL || 'http://localhost:3000/api';
                        const serverBaseUrl = apiBaseUrl.replace('/api', '');
                        imageUrl = `${serverBaseUrl}${imageUrl}`;
                      }
                      
                      return (
                        <div key={field}>
                          <ImageUpload
                            label={field === 'logoImage' ? 'Company Logo Image' : `${sectionDef.name} Image`}
                            currentImage={imageUrl}
                            onImageChange={(url) => {
                              // Store relative URL if it's a server URL
                              let finalUrl = url;
                              if (url && url.startsWith('http://localhost:3000')) {
                                finalUrl = url.replace('http://localhost:3000', '');
                              }
                              if (field === 'logoImage') {
                                handleFieldChange(sectionDef.id, field, finalUrl);
                              } else {
                                handleImageChange(sectionDef.id, finalUrl);
                              }
                            }}
                          />
                        </div>
                      );
                    }

                    if (field === 'logoDisplay') {
                      return (
                        <div key={field}>
                          <label htmlFor={`${sectionDef.id}-${field}`} className="block font-dosis font-semibold mb-2">
                            Logo Display Option
                          </label>
                          <select
                            id={`${sectionDef.id}-${field}`}
                            value={section[field] || 'text'}
                            onChange={(e) => handleFieldChange(sectionDef.id, field, e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-reshow-red focus:border-reshow-red font-dosis"
                          >
                            <option value="text">Text Only</option>
                            <option value="logo">Logo Only (requires logo image)</option>
                            <option value="both">Logo and Text Together</option>
                          </select>
                          <p className="text-sm text-gray-500 font-dosis mt-1">
                            Choose how the company name appears in the navbar
                          </p>
                        </div>
                      );
                    }

                    const fieldLabel = field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1');
                    const isTextarea = ['description', 'description2', 'address', 'subtitle', 'tagline', 'content', 'description1', 'description2'].includes(field);

                    return (
                      <div key={field}>
                        <label className="block font-dosis font-semibold mb-2">{fieldLabel}</label>
                        {isTextarea ? (
                          <textarea
                            value={section[field] || ''}
                            onChange={(e) => handleFieldChange(sectionDef.id, field, e.target.value)}
                            rows="4"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-reshow-red font-dosis"
                          />
                        ) : (
                          <input
                            type="text"
                            value={section[field] || ''}
                            onChange={(e) => handleFieldChange(sectionDef.id, field, e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-reshow-red font-dosis"
                          />
                        )}
                      </div>
                    );
                  })}

                  {/* List Fields (Benefits, Categories, Products) */}
                  {sectionDef.isList && sectionDef.listField && (
                    <div className="mt-6 border-t pt-6">
                      <div className="flex justify-between items-center mb-4">
                        <div>
                            <label className="block font-dosis font-semibold text-lg">
                              {sectionDef.listField === 'benefits' ? 'Benefits' : 
                               sectionDef.listField === 'categories' ? 'Product Categories' : 
                               sectionDef.listField === 'logos' ? 'Company Logos' :
                               sectionDef.listField === 'images' ? 'Gallery Images' :
                               sectionDef.listField === 'values' ? 'Values' :
                               sectionDef.listField === 'clients' ? 'Clients' :
                               'Products'}
                            </label>
                          {sectionDef.listField === 'products' && (
                            <p className="text-sm text-gray-600 font-dosis mt-1">
                              Add products to showcase on the homepage. Click "Add Product" to add more items.
                            </p>
                          )}
                          {sectionDef.listField === 'logos' && (
                            <p className="text-sm text-gray-600 font-dosis mt-1">
                              Add company logos to display on the homepage. Click "Add Logo" to add more companies.
                            </p>
                          )}
                        </div>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            
                            // Get current section state directly from sections
                            const currentSection = sections[sectionDef.id] || {};
                            const existingList = Array.isArray(currentSection[sectionDef.listField]) 
                              ? currentSection[sectionDef.listField] 
                              : [];
                            
                            // Create new item based on type
                            const newItem = sectionDef.listField === 'benefits' 
                              ? ''
                              : sectionDef.listField === 'categories'
                              ? { id: Date.now(), title: '', description: '', image: '' }
                              : sectionDef.listField === 'logos'
                              ? { id: Date.now(), name: '', image: '' }
                              : sectionDef.listField === 'images'
                              ? { id: Date.now(), name: '', alt: '', image: '' }
                              : sectionDef.listField === 'values'
                              ? { id: Date.now(), title: '', description: '' }
                              : sectionDef.listField === 'clients'
                              ? ''
                              : { id: Date.now(), title: '', image: '' };
                            
                            // Create updated list
                            const updatedList = [...existingList, newItem];
                            
                            console.log('Adding item to:', sectionDef.id, sectionDef.listField);
                            console.log('Current section:', currentSection);
                            console.log('Existing list:', existingList);
                            console.log('New item:', newItem);
                            console.log('Updated list:', updatedList);
                            
                            // Update the section with new list
                            handleFieldChange(sectionDef.id, sectionDef.listField, updatedList);
                          }}
                          type="button"
                          className="bg-reshow-red text-white px-4 py-2 rounded-lg text-sm font-dosis font-semibold hover:bg-reshow-dark-red transition-colors shadow-md hover:shadow-lg"
                        >
                          + Add {sectionDef.listField === 'benefits' ? 'Benefit' : 
                                sectionDef.listField === 'categories' ? 'Category' : 
                                sectionDef.listField === 'logos' ? 'Logo' : 
                                sectionDef.listField === 'images' ? 'Image' : 
                                sectionDef.listField === 'values' ? 'Value' : 
                                sectionDef.listField === 'clients' ? 'Client' : 
                                'Product'}
                        </button>
                      </div>

                      <div className="space-y-4">
                        {(section[sectionDef.listField] || []).map((item, index) => (
                          <div key={index} className="border border-gray-300 rounded-lg p-4 bg-white">
                            {sectionDef.listField === 'benefits' ? (
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  value={item || ''}
                                  onChange={(e) => {
                                    const list = [...(section[sectionDef.listField] || [])];
                                    list[index] = e.target.value;
                                    handleFieldChange(sectionDef.id, sectionDef.listField, list);
                                  }}
                                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-reshow-red font-dosis"
                                  placeholder="Enter benefit text"
                                />
                                <button
                                  onClick={() => {
                                    const list = [...(section[sectionDef.listField] || [])];
                                    list.splice(index, 1);
                                    handleFieldChange(sectionDef.id, sectionDef.listField, list);
                                  }}
                                  className="bg-red-500 text-white px-4 py-2 rounded-lg font-dosis font-semibold hover:bg-red-600"
                                >
                                  Remove
                                </button>
                              </div>
                            ) : sectionDef.listField === 'categories' ? (
                              <div className="space-y-3">
                                <input
                                  type="text"
                                  value={item.title || ''}
                                  onChange={(e) => {
                                    const list = [...(section[sectionDef.listField] || [])];
                                    list[index] = { ...item, title: e.target.value };
                                    handleFieldChange(sectionDef.id, sectionDef.listField, list);
                                  }}
                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-reshow-red font-dosis"
                                  placeholder="Category Title"
                                />
                                <textarea
                                  value={item.description || ''}
                                  onChange={(e) => {
                                    const list = [...(section[sectionDef.listField] || [])];
                                    list[index] = { ...item, description: e.target.value };
                                    handleFieldChange(sectionDef.id, sectionDef.listField, list);
                                  }}
                                  rows="2"
                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-reshow-red font-dosis"
                                  placeholder="Category Description"
                                />
                                <div className="flex gap-2">
                                  <div className="flex-1">
                                    <ImageUpload
                                      label="Category Image"
                                      currentImage={item.image ? (item.image.startsWith('http') || item.image.startsWith('/images') ? item.image : `${api.defaults.baseURL?.replace('/api', '') || 'http://localhost:3000'}${item.image}`) : ''}
                                      onImageChange={(url) => {
                                        const list = [...(section[sectionDef.listField] || [])];
                                        let finalUrl = url;
                                        if (url && url.startsWith('http://localhost:3000')) {
                                          finalUrl = url.replace('http://localhost:3000', '');
                                        }
                                        list[index] = { ...item, image: finalUrl };
                                        handleFieldChange(sectionDef.id, sectionDef.listField, list);
                                      }}
                                    />
                                  </div>
                                  <button
                                    onClick={() => {
                                      const list = [...(section[sectionDef.listField] || [])];
                                      list.splice(index, 1);
                                      handleFieldChange(sectionDef.id, sectionDef.listField, list);
                                    }}
                                    className="bg-red-500 text-white px-4 py-2 rounded-lg font-dosis font-semibold hover:bg-red-600 self-start mt-8"
                                  >
                                    Remove
                                  </button>
                                </div>
                              </div>
                            ) : sectionDef.listField === 'logos' ? (
                              <div className="space-y-3">
                                <input
                                  type="text"
                                  value={item.name || ''}
                                  onChange={(e) => {
                                    const list = [...(section[sectionDef.listField] || [])];
                                    list[index] = { ...item, name: e.target.value };
                                    handleFieldChange(sectionDef.id, sectionDef.listField, list);
                                  }}
                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-reshow-red font-dosis"
                                  placeholder="Company Name"
                                />
                                <div className="flex gap-2">
                                  <div className="flex-1">
                                    <ImageUpload
                                      label="Company Logo"
                                      currentImage={item.image ? (item.image.startsWith('http') || item.image.startsWith('/images') ? item.image : `${api.defaults.baseURL?.replace('/api', '') || 'http://localhost:3000'}${item.image}`) : ''}
                                      onImageChange={(url) => {
                                        const list = [...(section[sectionDef.listField] || [])];
                                        let finalUrl = url;
                                        if (url && url.startsWith('http://localhost:3000')) {
                                          finalUrl = url.replace('http://localhost:3000', '');
                                        }
                                        list[index] = { ...item, image: finalUrl };
                                        handleFieldChange(sectionDef.id, sectionDef.listField, list);
                                      }}
                                    />
                                  </div>
                                  <button
                                    onClick={() => {
                                      const list = [...(section[sectionDef.listField] || [])];
                                      list.splice(index, 1);
                                      handleFieldChange(sectionDef.id, sectionDef.listField, list);
                                    }}
                                    className="bg-red-500 text-white px-4 py-2 rounded-lg font-dosis font-semibold hover:bg-red-600 self-start mt-8"
                                  >
                                    Remove
                                  </button>
                                </div>
                              </div>
                            ) : sectionDef.listField === 'images' ? (
                              <div className="space-y-3">
                                <input
                                  type="text"
                                  value={item.name || ''}
                                  onChange={(e) => {
                                    const list = [...(section[sectionDef.listField] || [])];
                                    list[index] = { ...item, name: e.target.value };
                                    handleFieldChange(sectionDef.id, sectionDef.listField, list);
                                  }}
                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-reshow-red font-dosis"
                                  placeholder="Image Name"
                                />
                                <input
                                  type="text"
                                  value={item.alt || ''}
                                  onChange={(e) => {
                                    const list = [...(section[sectionDef.listField] || [])];
                                    list[index] = { ...item, alt: e.target.value };
                                    handleFieldChange(sectionDef.id, sectionDef.listField, list);
                                  }}
                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-reshow-red font-dosis"
                                  placeholder="Alt Text (optional)"
                                />
                                <div className="flex gap-2">
                                  <div className="flex-1">
                                    <ImageUpload
                                      label="Gallery Image"
                                      currentImage={item.image ? (item.image.startsWith('http') || item.image.startsWith('/images') ? item.image : `${api.defaults.baseURL?.replace('/api', '') || 'http://localhost:3000'}${item.image}`) : ''}
                                      onImageChange={(url) => {
                                        const list = [...(section[sectionDef.listField] || [])];
                                        let finalUrl = url;
                                        if (url && url.startsWith('http://localhost:3000')) {
                                          finalUrl = url.replace('http://localhost:3000', '');
                                        }
                                        list[index] = { ...item, image: finalUrl };
                                        handleFieldChange(sectionDef.id, sectionDef.listField, list);
                                      }}
                                    />
                                  </div>
                                  <button
                                    onClick={() => {
                                      const list = [...(section[sectionDef.listField] || [])];
                                      list.splice(index, 1);
                                      handleFieldChange(sectionDef.id, sectionDef.listField, list);
                                    }}
                                    className="bg-red-500 text-white px-4 py-2 rounded-lg font-dosis font-semibold hover:bg-red-600 self-start mt-8"
                                  >
                                    Remove
                                  </button>
                                </div>
                              </div>
                            ) : sectionDef.listField === 'values' ? (
                              <div className="space-y-3">
                                <input
                                  type="text"
                                  value={item.title || ''}
                                  onChange={(e) => {
                                    const list = [...(section[sectionDef.listField] || [])];
                                    list[index] = { ...item, title: e.target.value };
                                    handleFieldChange(sectionDef.id, sectionDef.listField, list);
                                  }}
                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-reshow-red font-dosis"
                                  placeholder="Value Title"
                                />
                                <textarea
                                  value={item.description || ''}
                                  onChange={(e) => {
                                    const list = [...(section[sectionDef.listField] || [])];
                                    list[index] = { ...item, description: e.target.value };
                                    handleFieldChange(sectionDef.id, sectionDef.listField, list);
                                  }}
                                  rows="2"
                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-reshow-red font-dosis"
                                  placeholder="Value Description"
                                />
                                <button
                                  onClick={() => {
                                    const list = [...(section[sectionDef.listField] || [])];
                                    list.splice(index, 1);
                                    handleFieldChange(sectionDef.id, sectionDef.listField, list);
                                  }}
                                  className="bg-red-500 text-white px-4 py-2 rounded-lg font-dosis font-semibold hover:bg-red-600"
                                >
                                  Remove
                                </button>
                              </div>
                            ) : sectionDef.listField === 'clients' ? (
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  value={item || ''}
                                  onChange={(e) => {
                                    const list = [...(section[sectionDef.listField] || [])];
                                    list[index] = e.target.value;
                                    handleFieldChange(sectionDef.id, sectionDef.listField, list);
                                  }}
                                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-reshow-red font-dosis"
                                  placeholder="Enter client name"
                                />
                                <button
                                  onClick={() => {
                                    const list = [...(section[sectionDef.listField] || [])];
                                    list.splice(index, 1);
                                    handleFieldChange(sectionDef.id, sectionDef.listField, list);
                                  }}
                                  className="bg-red-500 text-white px-4 py-2 rounded-lg font-dosis font-semibold hover:bg-red-600"
                                >
                                  Remove
                                </button>
                              </div>
                            ) : (
                              <div className="space-y-3">
                                <input
                                  type="text"
                                  value={item.title || ''}
                                  onChange={(e) => {
                                    const list = [...(section[sectionDef.listField] || [])];
                                    list[index] = { ...item, title: e.target.value };
                                    handleFieldChange(sectionDef.id, sectionDef.listField, list);
                                  }}
                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-reshow-red font-dosis"
                                  placeholder="Product Title"
                                />
                                <div className="flex gap-2">
                                  <div className="flex-1">
                                    <ImageUpload
                                      label="Product Image"
                                      currentImage={item.image ? (item.image.startsWith('http') || item.image.startsWith('/images') ? item.image : `${api.defaults.baseURL?.replace('/api', '') || 'http://localhost:3000'}${item.image}`) : ''}
                                      onImageChange={(url) => {
                                        const list = [...(section[sectionDef.listField] || [])];
                                        let finalUrl = url;
                                        if (url && url.startsWith('http://localhost:3000')) {
                                          finalUrl = url.replace('http://localhost:3000', '');
                                        }
                                        list[index] = { ...item, image: finalUrl };
                                        handleFieldChange(sectionDef.id, sectionDef.listField, list);
                                      }}
                                    />
                                  </div>
                                  <button
                                    onClick={() => {
                                      const list = [...(section[sectionDef.listField] || [])];
                                      list.splice(index, 1);
                                      handleFieldChange(sectionDef.id, sectionDef.listField, list);
                                    }}
                                    className="bg-red-500 text-white px-4 py-2 rounded-lg font-dosis font-semibold hover:bg-red-600 self-start mt-8"
                                  >
                                    Remove
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Experience Images Section */}
                  {sectionDef.id === 'experience' && sectionDef.hasImages && (
                    <div className="mt-6 border-t pt-6">
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <label className="block font-dosis font-semibold text-lg">
                            Experience Images
                          </label>
                          <p className="text-sm text-gray-600 font-dosis mt-1">
                            Add images to display in the Experience section. Click "Add Image" to add more items.
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            
                            const currentSection = sections[sectionDef.id] || {};
                            const existingImages = Array.isArray(currentSection.images) 
                              ? currentSection.images 
                              : [];
                            
                            const newImage = { id: Date.now(), image: '', alt: 'Our Experience' };
                            const updatedImages = [...existingImages, newImage];
                            
                            handleFieldChange(sectionDef.id, 'images', updatedImages);
                          }}
                          type="button"
                          className="bg-reshow-red text-white px-4 py-2 rounded-lg text-sm font-dosis font-semibold hover:bg-reshow-dark-red transition-colors shadow-md hover:shadow-lg"
                        >
                          + Add Image
                        </button>
                      </div>

                      <div className="space-y-4">
                        {(section.images || []).map((img, index) => (
                          <div key={index} className="border border-gray-300 rounded-lg p-4 bg-white">
                            <div className="space-y-3">
                              <input
                                type="text"
                                value={img.alt || ''}
                                onChange={(e) => {
                                  const images = [...(section.images || [])];
                                  images[index] = { ...img, alt: e.target.value };
                                  handleFieldChange(sectionDef.id, 'images', images);
                                }}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-reshow-red font-dosis"
                                placeholder="Alt Text (optional)"
                              />
                              <div className="flex gap-2">
                                <div className="flex-1">
                                  <ImageUpload
                                    label="Experience Image"
                                    currentImage={img.image ? (img.image.startsWith('http') || img.image.startsWith('/images') ? img.image : `${api.defaults.baseURL?.replace('/api', '') || 'http://localhost:3000'}${img.image}`) : ''}
                                    onImageChange={(url) => {
                                      const images = [...(section.images || [])];
                                      let finalUrl = url;
                                      if (url && url.startsWith('http://localhost:3000')) {
                                        finalUrl = url.replace('http://localhost:3000', '');
                                      }
                                      images[index] = { ...img, image: finalUrl };
                                      handleFieldChange(sectionDef.id, 'images', images);
                                    }}
                                  />
                                </div>
                                <button
                                  onClick={() => {
                                    const images = [...(section.images || [])];
                                    images.splice(index, 1);
                                    handleFieldChange(sectionDef.id, 'images', images);
                                  }}
                                  className="bg-red-500 text-white px-4 py-2 rounded-lg font-dosis font-semibold hover:bg-red-600 self-start mt-8"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            );
          };

          return (
            <>
              {/* HOME PAGE SECTIONS */}
              <div>
                <h2 className="text-2xl font-bold font-dinbek text-reshow-dark mb-4 pb-2 border-b-2 border-reshow-red">🏠 Home Page Sections</h2>
                <div className="space-y-6">
                  {sectionDefinitions.filter(s => s.id === 'hero' || s.id === 'whyChoose' || s.id === 'productCategories' || s.id === 'productShowcase' || s.id === 'companyLogos').map(renderSection)}
                </div>
              </div>

              {/* ABOUT PAGE */}
              <div>
                <h2 className="text-2xl font-bold font-dinbek text-reshow-dark mb-4 pb-2 border-b-2 border-reshow-red">📄 About Page</h2>
                <div className="space-y-6">
                  {sectionDefinitions.filter(s => s.id === 'aboutHero' || s.id === 'aboutStats' || s.id === 'mission' || s.id === 'vision' || s.id === 'values' || s.id === 'partnership' || s.id === 'experience').map(renderSection)}
                </div>
              </div>

              {/* PRODUCTS PAGE */}
              <div>
                <h2 className="text-2xl font-bold font-dinbek text-reshow-dark mb-4 pb-2 border-b-2 border-reshow-red">🛍️ Products Page</h2>
                <div className="space-y-6">
                  {/* Products List Management */}
                  <div className="border rounded-lg p-6 bg-gray-50">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-bold font-dinbek text-reshow-dark">Products List</h3>
                      <button
                        onClick={() => {
                          if (showProductForm) {
                            resetProductForm();
                          } else {
                            setShowProductForm(true);
                          }
                        }}
                        className="bg-reshow-red text-white px-4 py-2 rounded-lg font-dosis font-semibold hover:bg-reshow-dark-red transition-colors"
                      >
                        {showProductForm ? 'Cancel' : '+ Add Product'}
                      </button>
                    </div>

                    {showProductForm && (
                      <form onSubmit={handleProductSubmit} className="bg-white p-6 rounded-lg mb-6 space-y-4 border border-gray-200">
                        <div>
                          <label className="block font-dosis font-semibold mb-2">Product Name *</label>
                          <input
                            type="text"
                            name="name"
                            value={productFormData.name}
                            onChange={handleProductChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-reshow-red font-dosis"
                          />
                        </div>
                        <div>
                          <label className="block font-dosis font-semibold mb-2">Category *</label>
                          <select
                            name="category"
                            value={productFormData.category}
                            onChange={handleProductChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-reshow-red font-dosis"
                          >
                            {productCategories.length > 0 ? (
                              productCategories.map(cat => (
                                <option key={cat.id} value={cat.name}>{cat.name}</option>
                              ))
                            ) : (
                              <option value="">Select Category</option>
                            )}
                          </select>
                        </div>
                        <div>
                          <label className="block font-dosis font-semibold mb-2">Description *</label>
                          <textarea
                            name="description"
                            value={productFormData.description}
                            onChange={handleProductChange}
                            required
                            rows="4"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-reshow-red font-dosis"
                          ></textarea>
                        </div>
                        <div>
                          <label className="block font-dosis font-semibold mb-2">Rating</label>
                          <StarRating
                            rating={productFormData.rating}
                            onRatingChange={handleProductRatingChange}
                            readonly={false}
                          />
                        </div>
                        <div>
                          <ImageUpload
                            label="Product Image"
                            currentImage={productFormData.image}
                            onImageChange={handleProductImageChange}
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={saving}
                          className="bg-reshow-red text-white px-6 py-2 rounded-lg font-dosis font-semibold hover:bg-reshow-dark-red transition-colors disabled:opacity-50"
                        >
                          {saving ? 'Saving...' : editingProduct ? 'Update Product' : 'Add Product'}
                        </button>
                      </form>
                    )}

                    {productsLoading ? (
                      <div className="text-center py-8 font-dosis text-gray-600">Loading products...</div>
                    ) : products.length === 0 ? (
                      <div className="text-center py-8 font-dosis text-gray-600 bg-white p-6 rounded-lg border border-gray-200">
                        No products yet. Click "Add Product" to add your first product!
                      </div>
                    ) : (
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {products.map(product => (
                          <div key={product.id} className="border rounded-lg p-4 bg-white flex flex-col">
                            <div className="relative w-full aspect-[4/3] bg-gray-100 rounded mb-3 overflow-hidden flex items-center justify-center">
                              {product.image ? (
                                <img
                                  src={getImageUrl(product.image)}
                                  alt={product.name}
                                  className="max-w-full max-h-full w-auto h-auto object-contain"
                                  onError={(e) => {
                                    e.target.src = '/images/placeholder.jpg';
                                  }}
                                />
                              ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-dosis text-sm">No Image</div>
                              )}
                            </div>
                            <h4 className="text-base font-bold font-dinbek mb-2 text-reshow-dark">{product.name}</h4>
                            {product.category && (
                              <span className="inline-block text-xs font-dosis text-reshow-red bg-red-50 px-2 py-1 rounded mb-2">
                                {product.category}
                              </span>
                            )}
                            <div className="mb-2">
                              <StarRating rating={product.rating || 0} readonly={true} size="sm" />
                            </div>
                            <p className="font-dosis text-gray-700 text-xs mb-3 line-clamp-2">{product.description}</p>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleProductEdit(product)}
                                className="flex-1 bg-reshow-dark text-white py-1.5 rounded-lg font-dosis font-semibold hover:bg-gray-800 transition-colors text-sm"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleProductDelete(product.id)}
                                className="flex-1 bg-red-500 text-white py-1.5 rounded-lg font-dosis font-semibold hover:bg-red-600 transition-colors text-sm"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* SERVICES PAGE */}
              <div>
                <h2 className="text-2xl font-bold font-dinbek text-reshow-dark mb-4 pb-2 border-b-2 border-reshow-red">🛠️ Services Page</h2>
                <div className="space-y-6">
                  {sectionDefinitions.filter(s => s.id === 'services').map(renderSection)}
                  
                  {/* Services List Management */}
                  <div className="border rounded-lg p-6 bg-gray-50">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-bold font-dinbek text-reshow-dark">Services List</h3>
                      <button
                        onClick={() => {
                          if (showServiceForm) {
                            resetServiceForm();
                          } else {
                            setShowServiceForm(true);
                          }
                        }}
                        className="bg-reshow-red text-white px-4 py-2 rounded-lg font-dosis font-semibold hover:bg-reshow-dark-red transition-colors"
                      >
                        {showServiceForm ? 'Cancel' : '+ Add Service'}
                      </button>
                    </div>

                    {showServiceForm && (
                      <form onSubmit={handleServiceSubmit} className="bg-white p-6 rounded-lg mb-6 space-y-4 border border-gray-200">
                        <div>
                          <label className="block font-dosis font-semibold mb-2">Service Title *</label>
                          <input
                            type="text"
                            name="title"
                            value={serviceFormData.title}
                            onChange={handleServiceChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-reshow-red font-dosis"
                          />
                        </div>
                        <div>
                          <label className="block font-dosis font-semibold mb-2">Description *</label>
                          <textarea
                            name="description"
                            value={serviceFormData.description}
                            onChange={handleServiceChange}
                            required
                            rows="4"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-reshow-red font-dosis"
                          ></textarea>
                        </div>
                        <div>
                          <label className="block font-dosis font-semibold mb-2">Category</label>
                          <select
                            name="category"
                            value={serviceFormData.category}
                            onChange={handleServiceChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-reshow-red font-dosis"
                          >
                            <option value="">No Category</option>
                            {serviceCategories.map(cat => (
                              <option key={cat.id} value={cat.name}>{cat.name}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block font-dosis font-semibold mb-2">Rating</label>
                          <StarRating
                            rating={serviceFormData.rating}
                            onRatingChange={handleServiceRatingChange}
                            readonly={false}
                          />
                        </div>
                        <div>
                          <ImageUpload
                            label="Service Image"
                            currentImage={serviceFormData.image}
                            onImageChange={handleServiceImageChange}
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

                    {servicesLoading ? (
                      <div className="text-center py-8 font-dosis text-gray-600">Loading services...</div>
                    ) : services.length === 0 ? (
                      <div className="text-center py-8 font-dosis text-gray-600 bg-white p-6 rounded-lg border border-gray-200">
                        No services yet. Click "Add Service" to add your first service!
                      </div>
                    ) : (
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {services.map(service => (
                          <div key={service.id} className="border rounded-lg p-4 bg-white flex flex-col">
                            <div className="relative w-full aspect-[4/3] bg-gray-100 rounded mb-3 overflow-hidden flex items-center justify-center">
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
                                <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-dosis text-sm">No Image</div>
                              )}
                            </div>
                            <h4 className="text-base font-bold font-dinbek mb-2 text-reshow-dark">{service.title}</h4>
                            {service.category && (
                              <span className="inline-block text-xs font-dosis text-reshow-red bg-red-50 px-2 py-1 rounded mb-2">
                                {service.category}
                              </span>
                            )}
                            <div className="mb-2">
                              <StarRating rating={service.rating || 0} readonly={true} size="sm" />
                            </div>
                            <p className="font-dosis text-gray-700 text-xs mb-3 line-clamp-2">{service.description}</p>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleServiceEdit(service)}
                                className="flex-1 bg-reshow-dark text-white py-1.5 rounded-lg font-dosis font-semibold hover:bg-gray-800 transition-colors text-sm"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleServiceDelete(service.id)}
                                className="flex-1 bg-red-500 text-white py-1.5 rounded-lg font-dosis font-semibold hover:bg-red-600 transition-colors text-sm"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* GALLERY PAGE */}
              <div>
                <h2 className="text-2xl font-bold font-dinbek text-reshow-dark mb-4 pb-2 border-b-2 border-reshow-red">🖼️ Gallery Page</h2>
                <div className="space-y-6">
                  {sectionDefinitions.filter(s => s.id === 'gallery').map(renderSection)}
                </div>
              </div>

              {/* CONTACT PAGE */}
              <div>
                <h2 className="text-2xl font-bold font-dinbek text-reshow-dark mb-4 pb-2 border-b-2 border-reshow-red">📧 Contact Page</h2>
                <div className="space-y-6">
                  {sectionDefinitions.filter(s => s.id === 'contact').map(renderSection)}
                </div>
              </div>

              {/* NAVBAR SETTINGS (All Pages) */}
              <div>
                <h2 className="text-2xl font-bold font-dinbek text-reshow-dark mb-4 pb-2 border-b-2 border-reshow-red">🧭 Navbar Settings (All Pages)</h2>
                <div className="space-y-6">
                  {sectionDefinitions.filter(s => s.id === 'navbar').map(renderSection)}
                </div>
              </div>

              {/* FOOTER (All Pages) */}
              <div>
                <h2 className="text-2xl font-bold font-dinbek text-reshow-dark mb-4 pb-2 border-b-2 border-reshow-red">🔗 Footer (All Pages)</h2>
                <div className="space-y-6">
                  {sectionDefinitions.filter(s => s.id === 'footer').map(renderSection)}
                </div>
              </div>
            </>
          );
        })()}
      </div>

      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="font-dosis text-sm text-gray-700">
          <strong>Note:</strong> The copyright text "© {new Date().getFullYear()} Reshow Investments (Pvt) Ltd. All rights reserved." 
          and the design credit "Designed by cybercothtechnetworks" are protected and cannot be edited.
        </p>
      </div>
    </div>
  );
};

export default AdminContent;

