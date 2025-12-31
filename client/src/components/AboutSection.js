import React from 'react';
import { Link } from 'react-router-dom';

const AboutSection = () => {
  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold font-dinbek mb-6 text-reshow-dark">
              About Reshow Investments
            </h2>
            <p className="text-lg font-dosis text-gray-700 mb-6">
              At Reshow Investments, we believe in the power of branding. With years of experience 
              in corporate branding, promotional gifts, and corporate apparel, we help businesses 
              make a lasting impression.
            </p>
            <p className="text-lg font-dosis text-gray-700 mb-8">
              Our mission is simple: "Name it we brand it." We transform your vision into reality, 
              creating memorable brand experiences that resonate with your audience and drive business growth.
            </p>
            <Link
              to="/about"
              className="inline-block bg-reshow-red text-white px-8 py-3 rounded-lg font-dosis font-semibold hover:bg-reshow-dark-red transition-colors"
            >
              Learn More About Us
            </Link>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-lg overflow-hidden shadow-xl">
              <img
                src="/images/placeholder/about-company.jpg"
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
          <div className="text-center">
            <div className="text-5xl font-bold font-dinbek text-reshow-red mb-2">10+</div>
            <div className="text-lg font-dosis text-gray-700">Years of Experience</div>
          </div>
          <div className="text-center">
            <div className="text-5xl font-bold font-dinbek text-reshow-red mb-2">500+</div>
            <div className="text-lg font-dosis text-gray-700">Happy Clients</div>
          </div>
          <div className="text-center">
            <div className="text-5xl font-bold font-dinbek text-reshow-red mb-2">1000+</div>
            <div className="text-lg font-dosis text-gray-700">Projects Completed</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;










