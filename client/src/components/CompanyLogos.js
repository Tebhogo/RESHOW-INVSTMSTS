import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const CompanyLogos = () => {
  const [content, setContent] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchContent = async () => {
      try {
        const res = await api.get('/content/companyLogos');
        console.log('Company Logos content fetched:', res.data);

        if (!isMounted) return;

        if (res.data) {
          setContent(res.data);
        }
      } catch (error) {
        console.error('Error fetching Company Logos content:', error);
        // Use default content if fetch fails
        setContent({
          title: 'Trusted by Companies We\'ve Worked With',
          logos: [
            { id: 1, name: 'Company 1', image: '/images/placeholder/logo1.png' },
            { id: 2, name: 'Company 2', image: '/images/placeholder/logo2.png' },
            { id: 3, name: 'Company 3', image: '/images/placeholder/logo3.png' },
            { id: 4, name: 'Company 4', image: '/images/placeholder/logo4.png' },
            { id: 5, name: 'Company 5', image: '/images/placeholder/logo5.png' },
          ],
        });
      }
    };

    fetchContent();

    return () => {
      isMounted = false;
    };
  }, []);

  const title = content?.title || 'Trusted by Companies We\'ve Worked With';
  const logos = content?.logos || [];

  if (logos.length === 0) {
    return null; // Don't render if no logos
  }

  return (
    <section className="w-full bg-white py-12">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <p className="text-[25px] uppercase tracking-wider text-gray-700 mb-8 font-dosis font-bold">
          {title}
        </p>

        <div className="flex justify-center items-center gap-8 flex-nowrap">
          {logos.map((logo) => {
            // Handle image URL
            let imageUrl = logo.image || '/images/placeholder.jpg';
            if (imageUrl.startsWith('/uploads')) {
              const apiBaseUrl = api.defaults.baseURL || 'http://localhost:3000/api';
              const serverBaseUrl = apiBaseUrl.replace('/api', '');
              imageUrl = `${serverBaseUrl}${imageUrl}`;
            } else if (!imageUrl.startsWith('http') && !imageUrl.startsWith('/images')) {
              const apiBaseUrl = api.defaults.baseURL || 'http://localhost:3000/api';
              const serverBaseUrl = apiBaseUrl.replace('/api', '');
              imageUrl = `${serverBaseUrl}${imageUrl}`;
            }

            return (
              <div
                key={logo.id}
                className="flex items-center justify-center h-24 md:h-28"
              >
                <img
                  src={imageUrl}
                  alt={logo.name || `Company ${logo.id}`}
                  className="h-16 md:h-20 max-w-full object-contain opacity-90 hover:opacity-100 transition-opacity"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CompanyLogos;

