import React, { useState, useEffect, useRef } from 'react';
import api from '../utils/api';

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [pageContent, setPageContent] = useState(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const intervalRef = useRef(null);

  useEffect(() => {
    fetchGalleryContent();
  }, []);

  const fetchGalleryContent = async () => {
    try {
      const res = await api.get('/content/gallery');
      if (res.data) {
        setPageContent(res.data);
        // Transform gallery images from API format
        const galleryImages = (res.data.images || []).map((img, idx) => {
          let imageUrl = img.image || img.src || '/images/placeholder.jpg';
          // Handle image URL
          if (imageUrl.startsWith('/uploads')) {
            const apiBaseUrl = api.defaults.baseURL || 'http://localhost:3000/api';
            const serverBaseUrl = apiBaseUrl.replace('/api', '');
            imageUrl = `${serverBaseUrl}${imageUrl}`;
          } else if (!imageUrl.startsWith('http') && !imageUrl.startsWith('/images')) {
            const apiBaseUrl = api.defaults.baseURL || 'http://localhost:3000/api';
            const serverBaseUrl = apiBaseUrl.replace('/api', '');
            imageUrl = `${serverBaseUrl}${imageUrl}`;
          }
          return {
            id: img.id || idx + 1,
            src: imageUrl,
            alt: img.alt || img.name || `Gallery Image ${idx + 1}`,
            thumbnail: imageUrl
          };
        });
        setImages(galleryImages.length > 0 ? galleryImages : []);
      }
    } catch (error) {
      console.error('Error fetching gallery content:', error);
      setPageContent({
        title: 'Gallery',
        description: 'Explore our portfolio of branding solutions and corporate products'
      });
      setImages([]);
    }
  };

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlaying && images.length > 0) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 2000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isAutoPlaying, images.length]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    // Resume autoplay after 5 seconds
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  // Responsive number of visible thumbnails
  const getNumVisible = () => {
    if (window.innerWidth >= 991) return 5;
    if (window.innerWidth >= 767) return 4;
    if (window.innerWidth >= 575) return 3;
    return 1;
  };

  const [numVisible, setNumVisible] = useState(getNumVisible());

  useEffect(() => {
    const handleResize = () => {
      setNumVisible(getNumVisible());
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getVisibleThumbnails = () => {
    const start = Math.max(0, currentIndex - Math.floor(numVisible / 2));
    const end = Math.min(images.length, start + numVisible);
    return images.slice(start, end);
  };

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="bg-reshow-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold font-dinbek mb-6 text-reshow-dark">
            {pageContent?.title || 'Gallery'}
          </h1>
          <p className="text-lg font-dosis text-gray-700">
            {pageContent?.description || 'Explore our portfolio of branding solutions and corporate products'}
          </p>
        </div>
      </section>

      {/* Gallery Carousel */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          {/* Main Image Display */}
          <div className="relative mb-8">
            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden shadow-xl flex items-center justify-center p-4">
              <img
                src={images[currentIndex]?.src}
                alt={images[currentIndex]?.alt}
                className="max-w-full max-h-full w-auto h-auto object-contain"
                onError={(e) => {
                  e.target.src = '/images/placeholder.jpg';
                }}
              />
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-reshow-red text-white p-3 rounded-full hover:bg-reshow-dark-red transition-colors shadow-lg z-10"
              aria-label="Previous image"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-reshow-red text-white p-3 rounded-full hover:bg-reshow-dark-red transition-colors shadow-lg z-10"
              aria-label="Next image"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Auto-play indicator */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentIndex
                      ? 'w-8 bg-reshow-red'
                      : 'w-2 bg-white/50 hover:bg-white/75'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Thumbnail Navigation */}
          <div className="flex justify-center gap-3 overflow-x-auto pb-4 scrollbar-hide">
            {images.map((image, index) => (
              <button
                key={image.id}
                onClick={() => goToSlide(index)}
                className={`flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 transition-all ${
                  index === currentIndex
                    ? 'border-reshow-red shadow-lg scale-105'
                    : 'border-gray-300 hover:border-reshow-red/50'
                }`}
              >
                <img
                  src={image.thumbnail || image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = '/images/placeholder.jpg';
                  }}
                />
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Gallery;

