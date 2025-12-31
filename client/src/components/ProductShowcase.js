import React, { useState, useEffect } from "react";
import api from "../utils/api";

const ProductShowcase = () => {
  const [content, setContent] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchContent = async () => {
      try {
        const res = await api.get('/content/productShowcase');
        console.log('Product Showcase content fetched:', res.data);

        if (!isMounted) return;

        if (res.data) {
          setContent(res.data);
        }
      } catch (error) {
        console.error('Error fetching Product Showcase content:', error);
        // Use default content if fetch fails
        setContent({
          title: 'Our Branding Solutions',
          description: 'A snapshot of our corporate branding, apparel, promotional gifts, and professional workwear solutions.',
          products: [
            {
              id: 1,
              title: "Workwear & PPE",
              image: "/images/placeholder/workwear.jpg",
            },
            {
              id: 2,
              title: "Corporate Apparel",
              image: "/images/placeholder/apparel.jpg",
            },
            {
              id: 3,
              title: "Branded Mugs",
              image: "/images/placeholder/mug.jpg",
            },
            {
              id: 4,
              title: "Promotional Bottles",
              image: "/images/placeholder/bottle.jpg",
            },
            {
              id: 5,
              title: "Gift Packaging",
              image: "/images/placeholder/packaging.jpg",
            },
            {
              id: 6,
              title: "Corporate Headwear",
              image: "/images/placeholder/cap.jpg",
            },
          ],
        });
      }
    };

    fetchContent();

    return () => {
      isMounted = false;
    };
  }, []);

  // Use fetched content or defaults
  const title = content?.title || 'Our Branding Solutions';
  const description = content?.description || 'A snapshot of our corporate branding, apparel, promotional gifts, and professional workwear solutions.';
  const products = content?.products || [];
  
  // Duplicate products for seamless loop - more duplicates for full width
  const duplicatedProducts = [...products, ...products, ...products, ...products, ...products];

  return (
    <section className="bg-white py-16 overflow-hidden w-full">
      <div className="w-full">
        
        {/* Section Title */}
        <div className="mb-10 text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold font-dinbek text-reshow-dark">
            {title}
          </h2>
          <p className="mt-3 font-dosis text-gray-600 max-w-2xl mx-auto">
            {description}
          </p>
        </div>

        {/* Top Ribbon - Moving Left to Right */}
        <div className="relative w-full overflow-hidden mb-6">
          <div className="flex animate-scroll-ribbon-left">
            {duplicatedProducts.map((item, index) => {
              // Handle image URL
              let imageUrl = item.image || '/images/placeholder.jpg';
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
                  key={`top-${item.id}-${index}`}
                  className="group relative flex-shrink-0 w-72 md:w-80 mx-3 rounded-xl border bg-gray-50 shadow-sm hover:shadow-lg transition-all"
                >
                  <div className="h-56 md:h-64 w-full bg-gray-100 flex items-center justify-center overflow-hidden rounded-t-xl p-2">
                    <img
                      src={imageUrl}
                      alt={item.title}
                      className="max-w-full max-h-full w-auto h-auto object-contain transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = '<div class="h-full w-full flex items-center justify-center text-gray-400 font-dosis text-center px-4">' + item.title + '</div>';
                      }}
                    />
                  </div>

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center rounded-xl">
                  <h3 className="text-white text-base md:text-lg font-semibold font-dinbek text-center px-4">
                    {item.title}
                  </h3>
                </div>

                {/* Title below image */}
                <div className="p-3 md:p-4">
                  <h3 className="text-base md:text-lg font-semibold font-dinbek text-reshow-dark text-center">
                    {item.title}
                  </h3>
                </div>
              </div>
            );
          })}
          </div>
        </div>

        {/* Bottom Ribbon - Moving Right to Left (Reverse) */}
        <div className="relative w-full overflow-hidden">
          <div className="flex animate-scroll-ribbon-right">
            {duplicatedProducts.map((item, index) => {
              // Handle image URL
              let imageUrl = item.image || '/images/placeholder.jpg';
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
                  key={`bottom-${item.id}-${index}`}
                  className="group relative flex-shrink-0 w-72 md:w-80 mx-3 rounded-xl border bg-gray-50 shadow-sm hover:shadow-lg transition-all"
                >
                  <div className="h-56 md:h-64 w-full bg-gray-100 flex items-center justify-center overflow-hidden rounded-t-xl p-2">
                    <img
                      src={imageUrl}
                      alt={item.title}
                      className="max-w-full max-h-full w-auto h-auto object-contain transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = '<div class="h-full w-full flex items-center justify-center text-gray-400 font-dosis text-center px-4">' + item.title + '</div>';
                      }}
                    />
                  </div>

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center rounded-xl">
                  <h3 className="text-white text-base md:text-lg font-semibold font-dinbek text-center px-4">
                    {item.title}
                  </h3>
                </div>

                {/* Title below image */}
                <div className="p-3 md:p-4">
                  <h3 className="text-base md:text-lg font-semibold font-dinbek text-reshow-dark text-center">
                    {item.title}
                  </h3>
                </div>
              </div>
            );
          })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;

