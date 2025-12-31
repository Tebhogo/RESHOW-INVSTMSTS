import React from 'react';
import { Link } from 'react-router-dom';

const ContactSection = () => {
  return (
    <section className="bg-white py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold font-dinbek mb-4 text-reshow-dark">Contact Us</h2>
          <p className="text-lg font-dosis text-gray-700 max-w-2xl mx-auto">
            Get in touch with us for all your branding and promotional needs
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold font-dinbek mb-4 text-reshow-dark">Get in Touch</h3>
              <div className="space-y-4 font-dosis text-gray-700">
                <div>
                  <h4 className="font-semibold text-reshow-dark mb-1">Address</h4>
                  <p>55 Cnr Herbert Chitepo & Rekai Tangwena</p>
                  <p>Belvedere, Harare, Zimbabwe</p>
                </div>
                <div>
                  <h4 className="font-semibold text-reshow-dark mb-1">Phone</h4>
                  <p>+263 779 363 766</p>
                  <p>+263 772 780 083</p>
                </div>
                <div>
                  <h4 className="font-semibold text-reshow-dark mb-1">Email</h4>
                  <a href="mailto:sales@reshow.co.zw" className="text-reshow-red hover:underline">
                    sales@reshow.co.zw
                  </a>
                </div>
                <div>
                  <h4 className="font-semibold text-reshow-dark mb-1">Social</h4>
                  <a
                    href="https://www.tiktok.com/@reshow91"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-reshow-red hover:underline"
                  >
                    TikTok: @reshow91
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Google Maps */}
          <div>
            <h3 className="text-xl font-bold font-dinbek mb-4 text-reshow-dark">Find Us</h3>
            <div className="w-full h-64 bg-gray-200 rounded-lg overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3798.123456789!2d31.033333!3d-17.833333!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTfCsDUwJzAwLjAiUyAzMcKwMDInMDAuMCJF!5e0!3m2!1sen!2szw!4v1234567890123!5m2!1sen!2szw"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              ></iframe>
            </div>
            <div className="mt-6 text-center">
              <Link
                to="/contact"
                className="inline-block bg-reshow-red text-white px-8 py-3 rounded-lg font-dosis font-semibold hover:bg-reshow-dark-red transition-colors"
              >
                Send us a Message
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;

