import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import MissionVision from '../components/MissionVision';
import LoginModal from '../components/LoginModal';
import PasswordChangeModal from '../components/PasswordChangeModal';
import api from '../utils/api';

const About = () => {
  const { user, login } = useContext(AuthContext);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isPasswordChangeModalOpen, setIsPasswordChangeModalOpen] = useState(false);
  const [passwordChangeUserId, setPasswordChangeUserId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const res = await api.get('/about');
      setContent(res.data);
      setError(null);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching content:', error);
      if (error.code === 'ECONNREFUSED' || error.message?.includes('ERR_CONNECTION_REFUSED')) {
        setError('Backend server is not running. Please start the server on port 5000.');
      } else if (error.response?.status === 404) {
        setError('About content not found. Please check the server configuration.');
      } else if (error.response?.status >= 500) {
        setError('Server error. Please try again later.');
      } else {
        setError('Failed to load content. Please check your connection and try again.');
      }
      setLoading(false);
    }
  };

  const handleLoginSuccess = async () => {
    // Check if user needs to change password
    try {
      const res = await api.get('/auth/me');
      if (res.data.mustChangePassword) {
        setPasswordChangeUserId(res.data.id);
        setIsPasswordChangeModalOpen(true);
      } else {
        setIsEditing(true);
      }
    } catch (error) {
      setIsEditing(true);
    }
  };

  const handlePasswordChangeSuccess = () => {
    setIsPasswordChangeModalOpen(false);
    setIsEditing(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/about', content);
      alert('Content saved successfully!');
      setIsEditing(false);
    } catch (error) {
      alert('Failed to save content. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (section, field, value) => {
    setContent((prev) => {
      const newContent = { ...prev };
      if (section === 'values') {
        const index = parseInt(field);
        newContent.values[index] = { ...newContent.values[index], [value.field]: value.value };
      } else if (field.includes('.')) {
        const [parent, child] = field.split('.');
        newContent[section] = { ...newContent[section], [parent]: { ...newContent[section][parent], [child]: value } };
      } else {
        newContent[section] = { ...newContent[section], [field]: value };
      }
      return newContent;
    });
  };

  if (loading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center font-dosis">Loading...</div>
      </div>
    );
  }

  if (!content && !loading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center px-4">
        <div className="text-center font-dosis max-w-md">
          <div className="text-red-500 text-xl font-semibold mb-4">Error loading content</div>
          {error && (
            <div className="text-gray-700 mb-4">{error}</div>
          )}
          <button
            onClick={fetchContent}
            className="bg-reshow-red text-white px-6 py-2 rounded-lg font-dosis font-semibold hover:bg-reshow-dark-red transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20">
      {/* Login Button - Show if not logged in */}
      {!user && (
        <div className="fixed top-24 right-4 z-40">
          <button
            onClick={() => setIsLoginModalOpen(true)}
            className="bg-reshow-red text-white px-4 py-2 rounded-lg font-dosis font-semibold hover:bg-reshow-dark-red transition-colors shadow-lg"
          >
            Admin Login
          </button>
        </div>
      )}


      {/* About Section */}
      {content && content.hero && (
        <section className="py-20 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      value={content.hero?.title || ''}
                      onChange={(e) => handleChange('hero', 'title', e.target.value)}
                      className="text-4xl font-bold font-dinbek mb-6 text-reshow-dark w-full border-2 border-reshow-red rounded px-2 py-1"
                    />
                    <textarea
                      value={content.hero?.description || ''}
                      onChange={(e) => handleChange('hero', 'description', e.target.value)}
                      className="text-lg font-dosis text-gray-700 mb-6 w-full border-2 border-reshow-red rounded px-2 py-1"
                      rows="4"
                    />
                    <textarea
                      value={content.hero?.description2 || ''}
                      onChange={(e) => handleChange('hero', 'description2', e.target.value)}
                      className="text-lg font-dosis text-gray-700 mb-8 w-full border-2 border-reshow-red rounded px-2 py-1"
                      rows="4"
                      placeholder="Second paragraph (optional)"
                    />
                  </>
                ) : (
                  <>
                    <h2 className="text-4xl font-bold font-dinbek mb-6 text-reshow-dark">
                      {content.hero?.title || 'About Reshow Investments'}
                    </h2>
                    <p className="text-lg font-dosis text-gray-700 mb-6">
                      {content.hero?.description || 'At Reshow Investments, we believe in the power of branding. With years of experience in corporate branding, promotional gifts, and corporate apparel, we help businesses make a lasting impression.'}
                    </p>
                    {content.hero?.description2 && (
                      <p className="text-lg font-dosis text-gray-700 mb-8">
                        {content.hero.description2}
                      </p>
                    )}
                  </>
                )}
              </div>
              <div className="relative">
                <div className="aspect-square rounded-lg overflow-hidden shadow-xl">
                  <img
                    src={(() => {
                      const imgUrl = content.hero?.image || '/images/placeholder/about-company.jpg';
                      if (imgUrl && imgUrl.startsWith('/uploads')) {
                        const apiBaseUrl = api.defaults.baseURL || 'http://localhost:5000/api';
                        const serverBaseUrl = apiBaseUrl.replace('/api', '');
                        return `${serverBaseUrl}${imgUrl}`;
                      }
                      return imgUrl;
                    })()}
                    alt="Reshow Investments"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = '/images/placeholder.jpg';
                    }}
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-reshow-red transform rotate-12 opacity-20"></div>
              </div>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              {isEditing ? (
                <>
                  <div className="text-center">
                    <input
                      type="text"
                      value={content.stats?.years || '10+'}
                      onChange={(e) => handleChange('stats', 'years', e.target.value)}
                      className="text-5xl font-bold font-dinbek text-reshow-red mb-2 w-full border-2 border-reshow-red rounded px-2 py-1 text-center"
                    />
                    <input
                      type="text"
                      value={content.stats?.yearsLabel || 'Years of Experience'}
                      onChange={(e) => handleChange('stats', 'yearsLabel', e.target.value)}
                      className="text-lg font-dosis text-gray-700 w-full border-2 border-reshow-red rounded px-2 py-1 text-center"
                    />
                  </div>
                  <div className="text-center">
                    <input
                      type="text"
                      value={content.stats?.clients || '500+'}
                      onChange={(e) => handleChange('stats', 'clients', e.target.value)}
                      className="text-5xl font-bold font-dinbek text-reshow-red mb-2 w-full border-2 border-reshow-red rounded px-2 py-1 text-center"
                    />
                    <input
                      type="text"
                      value={content.stats?.clientsLabel || 'Happy Clients'}
                      onChange={(e) => handleChange('stats', 'clientsLabel', e.target.value)}
                      className="text-lg font-dosis text-gray-700 w-full border-2 border-reshow-red rounded px-2 py-1 text-center"
                    />
                  </div>
                  <div className="text-center">
                    <input
                      type="text"
                      value={content.stats?.projects || '1000+'}
                      onChange={(e) => handleChange('stats', 'projects', e.target.value)}
                      className="text-5xl font-bold font-dinbek text-reshow-red mb-2 w-full border-2 border-reshow-red rounded px-2 py-1 text-center"
                    />
                    <input
                      type="text"
                      value={content.stats?.projectsLabel || 'Projects Completed'}
                      onChange={(e) => handleChange('stats', 'projectsLabel', e.target.value)}
                      className="text-lg font-dosis text-gray-700 w-full border-2 border-reshow-red rounded px-2 py-1 text-center"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="text-center">
                    <div className="text-5xl font-bold font-dinbek text-reshow-red mb-2">
                      {content.stats?.years || '10+'}
                    </div>
                    <div className="text-lg font-dosis text-gray-700">
                      {content.stats?.yearsLabel || 'Years of Experience'}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-5xl font-bold font-dinbek text-reshow-red mb-2">
                      {content.stats?.clients || '500+'}
                    </div>
                    <div className="text-lg font-dosis text-gray-700">
                      {content.stats?.clientsLabel || 'Happy Clients'}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-5xl font-bold font-dinbek text-reshow-red mb-2">
                      {content.stats?.projects || '1000+'}
                    </div>
                    <div className="text-lg font-dosis text-gray-700">
                      {content.stats?.projectsLabel || 'Projects Completed'}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Mission & Vision */}
      {content && content.mission && content.vision && (
        <MissionVision
          mission={content.mission}
          vision={content.vision}
          isEditing={isEditing}
          onMissionChange={(field, value) => handleChange('mission', field, value)}
          onVisionChange={(field, value) => handleChange('vision', field, value)}
        />
      )}

      {/* Values */}
      {content && content.values && (
        <section className="py-16 px-4 bg-reshow-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold font-dinbek text-center mb-12 text-reshow-dark">
              Our Values
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {content.values.map((value, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg border-l-4 border-reshow-dark">
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      value={value.title}
                      onChange={(e) => handleChange('values', index, { field: 'title', value: e.target.value })}
                      className="text-xl font-bold font-dinbek mb-2 text-reshow-dark w-full border-2 border-reshow-red rounded px-2 py-1"
                    />
                    <textarea
                      value={value.description}
                      onChange={(e) => handleChange('values', index, { field: 'description', value: e.target.value })}
                      className="font-dosis text-gray-700 w-full border-2 border-reshow-red rounded px-2 py-1"
                      rows="3"
                    />
                  </>
                ) : (
                  <>
                    <h3 className="text-xl font-bold font-dinbek mb-2 text-reshow-dark">{value.title}</h3>
                    <p className="font-dosis text-gray-700">{value.description}</p>
                  </>
                )}
              </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Partnership */}
      {content && content.partnership && (
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold font-dinbek mb-12 text-center text-reshow-dark">
              {content.partnership?.title || 'Partnership'}
            </h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              {isEditing ? (
                <>
                  <input
                    type="text"
                    value={content.partnership?.partnerName || ''}
                    onChange={(e) => handleChange('partnership', 'partnerName', e.target.value)}
                    className="text-2xl font-bold font-dinbek mb-4 text-reshow-dark w-full border-2 border-reshow-red rounded px-2 py-1"
                  />
                  <textarea
                    value={content.partnership?.description1 || ''}
                    onChange={(e) => handleChange('partnership', 'description1', e.target.value)}
                    className="font-dosis text-gray-700 mb-4 w-full border-2 border-reshow-red rounded px-2 py-1"
                    rows="3"
                  />
                  <textarea
                    value={content.partnership?.description2 || ''}
                    onChange={(e) => handleChange('partnership', 'description2', e.target.value)}
                    className="font-dosis text-gray-700 w-full border-2 border-reshow-red rounded px-2 py-1"
                    rows="3"
                  />
                </>
              ) : (
                <>
                  <h3 className="text-2xl font-bold font-dinbek mb-4 text-reshow-dark">{content.partnership?.partnerName || ''}</h3>
                  <p className="font-dosis text-gray-700 mb-4">{content.partnership?.description1 || ''}</p>
                  <p className="font-dosis text-gray-700">{content.partnership?.description2 || ''}</p>
                </>
              )}
            </div>
            <div className="order-1 md:order-2">
              <div className="relative">
                <div className="aspect-video rounded-lg overflow-hidden shadow-xl">
                  <img
                    src={(() => {
                      const imgUrl = content.partnership?.image || '/images/placeholder/barron-partnership.jpg';
                      if (imgUrl && imgUrl.startsWith('/uploads')) {
                        const apiBaseUrl = api.defaults.baseURL || 'http://localhost:5000/api';
                        const serverBaseUrl = apiBaseUrl.replace('/api', '');
                        return `${serverBaseUrl}${imgUrl}`;
                      }
                      return imgUrl;
                    })()}
                    alt="BARRON Partnership"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = '/images/placeholder.jpg';
                    }}
                  />
                </div>
                <div className="absolute -top-4 -left-4 w-20 h-20 bg-reshow-red transform -rotate-12 opacity-20"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* Experience */}
      {content && content.experience && (
        <section className="py-16 px-4 bg-reshow-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold font-dinbek text-center mb-12 text-reshow-dark">
              {content.experience?.title || 'Our Experience'}
            </h2>
          <div className="grid md:grid-cols-2 gap-12 items-center mb-12">
            <div>
              {isEditing ? (
                <textarea
                  value={content.experience?.description || ''}
                  onChange={(e) => handleChange('experience', 'description', e.target.value)}
                  className="font-dosis text-lg text-gray-700 mb-6 w-full border-2 border-reshow-red rounded px-2 py-1"
                  rows="2"
                />
              ) : (
                <p className="font-dosis text-lg text-gray-700 mb-6">{content.experience?.description || ''}</p>
              )}
              <div className="grid gap-4">
                {(content.experience?.clients || []).map((client, index) => (
                  <div key={index} className="flex items-center">
                    {isEditing ? (
                      <input
                        type="text"
                        value={client}
                        onChange={(e) => {
                          const newClients = [...(content.experience?.clients || [])];
                          newClients[index] = e.target.value;
                          setContent((prev) => ({
                            ...prev,
                            experience: { ...prev.experience, clients: newClients }
                          }));
                        }}
                        className="flex-1 font-dosis text-gray-700 border-2 border-reshow-red rounded px-2 py-1"
                      />
                    ) : (
                      <>
                        <span className="text-reshow-red mr-3 text-xl">✓</span>
                        <span className="font-dosis text-gray-700">{client}</span>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {(content.experience?.images || [
                { image: '/images/placeholder/experience-1.jpg', alt: 'Our Experience' },
                { image: '/images/placeholder/experience-2.jpg', alt: 'Our Experience' },
                { image: '/images/placeholder/experience-3.jpg', alt: 'Our Experience' },
                { image: '/images/placeholder/experience-4.jpg', alt: 'Our Experience' }
              ]).map((img, index) => {
                let imageUrl = img.image || `/images/placeholder/experience-${index + 1}.jpg`;
                if (imageUrl && imageUrl.startsWith('/uploads')) {
                  const apiBaseUrl = api.defaults.baseURL || 'http://localhost:5000/api';
                  const serverBaseUrl = apiBaseUrl.replace('/api', '');
                  imageUrl = `${serverBaseUrl}${imageUrl}`;
                }
                return (
                  <div key={index} className="aspect-square rounded-lg overflow-hidden shadow-lg">
                    <img
                      src={imageUrl}
                      alt={img.alt || 'Our Experience'}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = '/images/placeholder.jpg';
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
      )}

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Password Change Modal */}
      <PasswordChangeModal
        isOpen={isPasswordChangeModalOpen}
        userId={passwordChangeUserId}
        onSuccess={handlePasswordChangeSuccess}
      />
    </div>
  );
};

export default About;
