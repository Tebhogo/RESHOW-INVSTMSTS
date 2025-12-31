import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";

const HeroWelcome = () => {
  const text = "Trusted Zimbabwean company specialising in corporate branding, promotional gifts, corporate apparel, and branding solutions.";
  const [displayText, setDisplayText] = useState("");
  const [index, setIndex] = useState(0);
  const [heroContent, setHeroContent] = useState(null);
  const [heroImage, setHeroImage] = useState("/images/placeholder/hero-image.jpg");
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    // Fetch hero content from API
    const fetchHeroContent = async () => {
      try {
        const res = await api.get('/content/hero');
        console.log('Hero content fetched:', res.data);
        
        // Only update state if component is still mounted
        if (!isMounted) return;
        
        if (res.data) {
          setHeroContent(res.data);
          
          // Handle image URL
          if (res.data.image) {
            let imageUrl = res.data.image;
            console.log('Original image path:', imageUrl);
            
            // If it's a relative path starting with /uploads, make it absolute
            if (imageUrl.startsWith('/uploads')) {
              // Get the API base URL and construct server URL
              const apiBaseUrl = api.defaults.baseURL || 'http://localhost:3000/api';
              let serverBaseUrl = apiBaseUrl.replace('/api', '');
              
              // If server might be on different port, try to detect
              // Check if we're using port 3000 but server might be on 5000
              if (serverBaseUrl.includes(':3000')) {
                // Try port 3000 first
                imageUrl = `${serverBaseUrl}${imageUrl}`;
              } else {
                // Use whatever port the API is on
                imageUrl = `${serverBaseUrl}${imageUrl}`;
              }
              
              console.log('API Base URL:', apiBaseUrl);
              console.log('Server Base URL:', serverBaseUrl);
              console.log('Constructed image URL:', imageUrl);
            } else if (!imageUrl.startsWith('http') && !imageUrl.startsWith('/images')) {
              // If it's a relative path but not /uploads or /images, also make it absolute
              const apiBaseUrl = api.defaults.baseURL || 'http://localhost:3000/api';
              const serverBaseUrl = apiBaseUrl.replace('/api', '');
              imageUrl = `${serverBaseUrl}${imageUrl}`;
              console.log('Constructed image URL:', imageUrl);
            }
            setHeroImage(imageUrl);
            setImageError(false); // Reset error state when new image is set
          } else {
            console.log('No image in hero content');
          }
        }
      } catch (error) {
        console.error('Error fetching hero content:', error);
        console.error('Error details:', error.response?.data || error.message);
        // Use default image if fetch fails - don't retry to prevent loops
      }
    };
    
    fetchHeroContent();
    
    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (index < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + text[index]);
        setIndex(index + 1);
      }, 50);
      return () => clearTimeout(timeout);
    }
  }, [index, text]);

  // Get the background image URL
  const backgroundImageUrl = imageError ? '/images/placeholder/hero-image.jpg' : heroImage;

  return (
    <section 
      className="relative pt-20 pb-40 min-h-[600px] md:min-h-[700px] flex items-center justify-center"
      style={{
        backgroundImage: `url(${backgroundImageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>

      {/* Hidden image for error handling */}
      <img
        src={backgroundImageUrl}
        alt="Reshow Branding"
        className="hidden"
        onError={(e) => {
          // Only handle error once to prevent infinite loops
          if (!imageError) {
            console.error('Image failed to load:', heroImage);
            console.error('Using fallback image');
            setImageError(true);
            // Set fallback image
            e.target.src = '/images/placeholder/hero-image.jpg';
          }
        }}
        onLoad={() => {
          if (!imageError) {
            console.log('Image loaded successfully:', heroImage);
          }
        }}
      />

      {/* Content on top of background */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        {/* COMPANY NAME */}
        <h1 className="text-4xl md:text-6xl font-bold font-dinbek text-white mb-6 drop-shadow-lg">
          {heroContent?.title || 'Reshow Investments (Pvt) Ltd'}
        </h1>

        {/* TAGLINE */}
        <p className="text-2xl md:text-3xl font-dosis text-white mb-8 drop-shadow-lg">
          {heroContent?.subtitle || 'Name it we brand it.'}
        </p>

        {/* TYPEWRITER TEXT */}
        <p className="text-lg md:text-2xl font-dosis text-white max-w-4xl mx-auto mb-10 min-h-[4rem] drop-shadow-lg">
          {heroContent?.description || displayText}
          {!heroContent?.description && index < text.length && (
            <span className="animate-pulse text-reshow-red">|</span>
          )}
        </p>

        {/* CTA BUTTONS */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/services"
            className="bg-reshow-red text-white px-8 py-3 rounded-lg font-dosis font-semibold hover:bg-reshow-dark-red transition-colors shadow-lg"
          >
            {heroContent?.buttonText || 'Request Quote'}
          </Link>
          <Link
            to="/contact"
            className="bg-white border-2 border-white text-reshow-red px-8 py-3 rounded-lg font-dosis font-semibold hover:bg-reshow-red hover:text-white hover:border-reshow-red transition-colors shadow-lg"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroWelcome;

