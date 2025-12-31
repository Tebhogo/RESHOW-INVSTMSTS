import React from 'react';
import { Link } from 'react-router-dom';
import HeroWelcome from '../components/HeroWelcome';
import ProductShowcase from '../components/ProductShowcase';
import WhyChooseReshow from '../components/WhyChooseReshow';
import ProductCategoriesSection from '../components/ProductCategoriesSection';
import CompanyLogos from '../components/CompanyLogos';

const Home = () => {
  return (
    <div className="pt-20">
      {/* Hero Welcome Section */}
      <HeroWelcome />

      {/* Why Choose Us */}
      <WhyChooseReshow />

      {/* Product Categories Section */}
      <ProductCategoriesSection />

      {/* Product Showcase */}
      <ProductShowcase />

      {/* Companies We've Worked With */}
      <CompanyLogos />
    </div>
  );
};

export default Home;

