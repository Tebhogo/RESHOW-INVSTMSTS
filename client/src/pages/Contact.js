import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [pageContent, setPageContent] = useState(null);

  useEffect(() => {
    fetchPageContent();
  }, []);

  const fetchPageContent = async () => {
    try {
      const res = await api.get('/content/contact');
      if (res.data) {
        setPageContent(res.data);
      }
    } catch (error) {
      console.error('Error fetching contact content:', error);
      setPageContent({
        title: 'Contact Us',
        description: 'Get in touch with us for all your branding and promotional needs',
        address: '55 Cnr Herbert Chitepo & Rekai Tangwena, Belvedere, Harare, Zimbabwe',
        phone: '+263 779 363 766',
        phone2: '+263 772 780 083',
        email: 'sales@reshow.co.zw'
      });
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      await api.post('/contact', formData);
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      alert('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="bg-reshow-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold font-dinbek mb-6 text-reshow-dark">
            {pageContent?.title || 'Contact Us'}
          </h1>
          <p className="text-lg font-dosis text-gray-700">
            {pageContent?.description || 'Get in touch with us for all your branding and promotional needs'}
          </p>
        </div>
      </section>

      <div className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold font-dinbek mb-6 text-reshow-dark">Send us a Message</h2>
            {success && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                Message sent successfully! We'll get back to you soon.
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-dosis font-semibold mb-2 text-reshow-dark">Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-reshow-red focus:border-transparent font-dosis"
                />
              </div>
              <div>
                <label className="block font-dosis font-semibold mb-2 text-reshow-dark">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-reshow-red focus:border-transparent font-dosis"
                />
              </div>
              <div>
                <label className="block font-dosis font-semibold mb-2 text-reshow-dark">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-reshow-red focus:border-transparent font-dosis"
                />
              </div>
              <div>
                <label className="block font-dosis font-semibold mb-2 text-reshow-dark">Subject *</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-reshow-red focus:border-transparent font-dosis"
                />
              </div>
              <div>
                <label className="block font-dosis font-semibold mb-2 text-reshow-dark">Message *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-reshow-red focus:border-transparent font-dosis"
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-reshow-red text-white py-3 rounded-lg font-dosis font-semibold hover:bg-reshow-dark-red transition-colors disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>

          {/* Contact Info & Map */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <h2 className="text-2xl font-bold font-dinbek mb-6 text-reshow-dark">Contact Information</h2>
              <div className="space-y-4 font-dosis text-gray-700">
                <div>
                  <h3 className="font-semibold text-reshow-dark mb-2">Address</h3>
                  {pageContent?.address ? (
                    pageContent.address.split(',').map((line, index) => (
                      <p key={index}>{line.trim()}</p>
                    ))
                  ) : (
                    <>
                      <p>55 Cnr Herbert Chitepo & Rekai Tangwena</p>
                      <p>Belvedere, Harare, Zimbabwe</p>
                    </>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-reshow-dark mb-2">Phone</h3>
                  <p>{pageContent?.phone || '+263 779 363 766'}</p>
                  {pageContent?.phone2 && <p>{pageContent.phone2}</p>}
                </div>
                <div>
                  <h3 className="font-semibold text-reshow-dark mb-2">Email</h3>
                  <p>{pageContent?.email || 'sales@reshow.co.zw'}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-reshow-dark mb-2">Social</h3>
                  <a
                    href="https://www.tiktok.com/@reshow91"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-reshow-red hover:underline"
                  >
                    TikTok: @reshow91
                  </a>
                </div>
              </div>
            </div>

            {/* Google Maps */}
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <h2 className="text-2xl font-bold font-dinbek mb-4 text-reshow-dark">Find Us</h2>
              <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3798.123456789!2d31.033333!3d-17.833333!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTfCsDUwJzAwLjAiUyAzMcKwMDInMDAuMCJF!5e0!3m2!1sen!2szw!4v1234567890123!5m2!1sen!2szw"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded-lg"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

