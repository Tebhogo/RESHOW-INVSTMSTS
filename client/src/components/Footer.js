import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

const Footer = () => {
  const [content, setContent] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchContent = async () => {
      try {
        const res = await api.get('/content/footer');
        console.log('Footer content fetched:', res.data);

        if (!isMounted) return;

        if (res.data) {
          setContent(res.data);
        }
      } catch (error) {
        console.error('Error fetching Footer content:', error);
        // Use default content if fetch fails
        setContent({
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
        });
      }
    };

    fetchContent();

    return () => {
      isMounted = false;
    };
  }, []);

  // Use fetched content or defaults
  const companyName = content?.companyName || 'Reshow Investments';
  const tagline = content?.tagline || 'Name it we brand it.';
  const address = content?.address || '55 Cnr Herbert Chitepo & Rekai Tangwena, Belvedere, Harare, Zimbabwe';
  const phone1 = content?.phone1 || '+263 779 363 766';
  const phone2 = content?.phone2 || '+263 772 780 083';
  const email = content?.email || 'sales@reshow.co.zw';
  const facebook = content?.facebook || 'https://facebook.com';
  const instagram = content?.instagram || 'https://instagram.com';
  const twitter = content?.twitter || 'https://twitter.com';
  const tiktok = content?.tiktok || 'https://tiktok.com';

  return (
    <footer className="bg-reshow-dark text-reshow-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold font-dinbek mb-4">{companyName}</h3>
            <p className="font-dosis text-sm opacity-90 mb-4">{tagline}</p>
            <div className="flex space-x-4">
              <a
                href={facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-reshow-white hover:text-reshow-red transition-colors"
                aria-label="Facebook"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a
                href={instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-reshow-white hover:text-reshow-red transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.98-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.98-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href={twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-reshow-white hover:text-reshow-red transition-colors"
                aria-label="Twitter"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a
                href={tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="text-reshow-white hover:text-reshow-red transition-colors"
                aria-label="TikTok"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-dinbek font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 font-dosis text-sm">
              <li><Link to="/about" className="hover:text-reshow-red transition-colors">About Us</Link></li>
              <li><Link to="/services" className="hover:text-reshow-red transition-colors">Services</Link></li>
              <li><Link to="/gallery" className="hover:text-reshow-red transition-colors">Gallery</Link></li>
              <li><Link to="/contact" className="hover:text-reshow-red transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-dinbek font-semibold mb-4">Contact</h4>
            <div className="font-dosis text-sm space-y-2 opacity-90">
              {address.split(',').map((line, index) => (
                <p key={index}>{line.trim()}</p>
              ))}
              <p>{phone1}</p>
              {phone2 && <p>{phone2}</p>}
              <p>{email}</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center font-dosis text-sm opacity-75 space-y-2">
          <p>&copy; {new Date().getFullYear()} Reshow Investments (Pvt) Ltd. All rights reserved.</p>
          <p className="text-xs opacity-60">
            Website designed by{' '}
            <a
              href="https://tebhogo.github.io/Cyber-Cotheth-tech-networks-/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold hover:text-reshow-red transition-colors underline"
            >
              cybercothtechnetworks
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

