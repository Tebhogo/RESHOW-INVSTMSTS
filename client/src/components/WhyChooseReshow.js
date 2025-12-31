import React, { useState, useEffect } from "react";
import api from "../utils/api";

const WhyChooseReshow = () => {
  const [content, setContent] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchContent = async () => {
      try {
        const res = await api.get('/content/whyChoose');
        console.log('WhyChoose content fetched:', res.data);

        if (!isMounted) return;

        if (res.data) {
          setContent(res.data);

          // Handle image URL
          if (res.data.image) {
            let imgUrl = res.data.image;
            console.log('Original image path:', imgUrl);

            // If it's a relative path starting with /uploads, make it absolute
            if (imgUrl.startsWith('/uploads')) {
              const apiBaseUrl = api.defaults.baseURL || 'http://localhost:3000/api';
              const serverBaseUrl = apiBaseUrl.replace('/api', '');
              imgUrl = `${serverBaseUrl}${imgUrl}`;
              console.log('Constructed image URL:', imgUrl);
            } else if (!imgUrl.startsWith('http') && !imgUrl.startsWith('/images')) {
              const apiBaseUrl = api.defaults.baseURL || 'http://localhost:3000/api';
              const serverBaseUrl = apiBaseUrl.replace('/api', '');
              imgUrl = `${serverBaseUrl}${imgUrl}`;
            }
            setImageUrl(imgUrl);
          }
        }
      } catch (error) {
        console.error('Error fetching WhyChoose content:', error);
        // Use default content if fetch fails
        setContent({
          title: 'Why Choose Reshow',
          benefits: [
            'Over a decade of industry experience',
            'International quality through BARRON partnership',
            'Customised branding solutions',
            'Reliable turnaround times',
            'Professional and customer-focused service'
          ]
        });
      }
    };

    fetchContent();

    return () => {
      isMounted = false;
    };
  }, []);

  const title = content?.title || 'Why Choose Reshow';
  const benefits = content?.benefits || [
    'Over a decade of industry experience',
    'International quality through BARRON partnership',
    'Customised branding solutions',
    'Reliable turnaround times',
    'Professional and customer-focused service'
  ];

  return (
    <section className="bg-gradient-to-r from-red-600 via-red-500 to-red-400 py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          
          {/* LEFT CONTENT */}
          <div className="text-white">
            <h2 className="text-4xl md:text-5xl font-bold font-dinbek mb-6 text-white">
              {title}
            </h2>

            <ul className="space-y-4 text-xl md:text-2xl font-dosis">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-white font-bold text-2xl md:text-3xl">✓</span>
                  <span className="text-white">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* RIGHT IMAGE */}
          <div className="relative w-full min-h-[480px] overflow-hidden rounded-xl bg-white shadow-lg flex items-center justify-center p-4">
            {imageUrl && !imageError ? (
              <img
                src={imageUrl}
                alt="Why Choose Reshow"
                className="max-w-full max-h-full w-auto h-auto object-contain"
                style={{ 
                  imageRendering: '-webkit-optimize-contrast',
                  filter: 'brightness(1.08) contrast(1.12) saturate(1.08)',
                  transform: 'translateZ(0)',
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  willChange: 'transform'
                }}
                onError={(e) => {
                  if (!imageError) {
                    console.error('Image failed to load:', imageUrl);
                    setImageError(true);
                  }
                }}
                onLoad={() => {
                  console.log('Image loaded successfully:', imageUrl);
                }}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-center font-dosis border border-dashed border-gray-300">
                <span>
                  Image Placeholder<br />
                  <span className="text-sm">(Upload Branding Image)</span>
                </span>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};

export default WhyChooseReshow;

