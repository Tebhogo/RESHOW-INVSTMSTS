import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

const ProductCategoriesSection = () => {
  const scrollContainerRef = useRef(null);
  const [content, setContent] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchContent = async () => {
      try {
        const res = await api.get('/content/productCategories');
        console.log('Product Categories content fetched:', res.data);

        if (!isMounted) return;

        if (res.data) {
          setContent(res.data);
        }
      } catch (error) {
        console.error('Error fetching Product Categories content:', error);
        // Use default content if fetch fails
        setContent({
          title: 'Explore Our Product Categories',
          subtitle: 'Products',
          description: 'Discover our comprehensive range of corporate branding solutions, promotional products, and professional apparel tailored to your needs.',
          buttonText: 'View Products',
          categories: [
            {
              id: 1,
              title: 'Corporate Apparel',
              description: 'Professional workwear and corporate clothing solutions',
              image: '/images/placeholder/apparel.jpg',
            },
            {
              id: 2,
              title: 'Promotional Gifts',
              description: 'Custom branded gifts and promotional items',
              image: '/images/placeholder/gifts.jpg',
            },
            {
              id: 3,
              title: 'Top Sellers',
              description: 'Our most popular branding solutions',
              image: '/images/placeholder/topsellers.jpg',
            },
            {
              id: 4,
              title: 'PPE Wear',
              description: 'Personal protective equipment and safety gear',
              image: '/images/placeholder/ppe.jpg',
            },
            {
              id: 5,
              title: 'Headwear',
              description: 'Branded caps, hats, and headwear solutions',
              image: '/images/placeholder/headwear.jpg',
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
  const title = content?.title || 'Explore Our Product Categories';
  const subtitle = content?.subtitle || 'Products';
  const description = content?.description || 'Discover our comprehensive range of corporate branding solutions, promotional products, and professional apparel tailored to your needs.';
  const buttonText = content?.buttonText || 'View Products';
  const productCategories = content?.categories || [];

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -400,
        behavior: 'smooth',
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 400,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="bg-gradient-to-r from-red-600 via-red-500 to-red-400 py-16">
      <div className="max-w-[1440px] mx-auto px-4">
        <div className="max-w-[1312px] mx-auto">
          
          {/* Section Header - Left Aligned */}
          <div className="mb-10 text-left">
            <span className="text-sm font-dosis text-white/80 uppercase tracking-wider mb-2 block">
              {subtitle}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold font-dinbek text-white mb-4">
              {title}
            </h2>
            <p className="text-lg font-dosis text-white/90 max-w-2xl">
              {description}
            </p>
          </div>

          {/* Desktop: Horizontal Scroll Carousel with Arrows */}
          <div className="relative">
            {/* Left Arrow Button - Desktop Only */}
            <button
              onClick={scrollLeft}
              className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow items-center justify-center w-12 h-12 border border-gray-200"
              aria-label="Scroll left"
            >
              <svg
                className="w-6 h-6 text-reshow-dark"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            {/* Scrollable Container */}
            <div
              ref={scrollContainerRef}
              className="flex gap-6 overflow-x-auto scrollbar-hide md:scroll-smooth md:overflow-x-scroll"
            >
              {productCategories.map((category) => {
                // Handle image URL
                let imageUrl = category.image || '/images/placeholder.jpg';
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
                    key={category.id}
                    className="flex-shrink-0 w-full md:w-80 bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                  >
                    {/* Image */}
                    <div className="h-64 bg-gray-100 overflow-hidden flex items-center justify-center p-2">
                      <img
                        src={imageUrl}
                        alt={category.title}
                        className="max-w-full max-h-full w-auto h-auto object-contain transition-transform duration-300 hover:scale-110"
                        onError={(e) => {
                          e.target.src = '/images/placeholder.jpg';
                        }}
                      />
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold font-dinbek text-reshow-dark mb-2">
                        {category.title}
                      </h3>
                      <p className="text-gray-600 font-dosis">
                        {category.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Arrow Button - Desktop Only */}
            <button
              onClick={scrollRight}
              className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow items-center justify-center w-12 h-12 border border-gray-200"
              aria-label="Scroll right"
            >
              <svg
                className="w-6 h-6 text-reshow-dark"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>

          {/* CTA Button */}
          <div className="mt-12 text-center">
            <Link
              to="/services"
              className="inline-block bg-reshow-red text-white px-8 py-3 rounded-lg font-dosis font-semibold hover:bg-reshow-dark-red transition-colors"
            >
              {buttonText}
            </Link>
          </div>
        </div>
      </div>

    </section>
  );
};

export default ProductCategoriesSection;

