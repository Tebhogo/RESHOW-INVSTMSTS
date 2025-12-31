import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import api from './utils/api';
import './App.css';

function AppContent() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  // Track visitor on page load (only once per session)
  useEffect(() => {
    // Only track on public pages, not admin pages
    if (!isAdminPage) {
      // Check if we've already tracked this session
      const tracked = sessionStorage.getItem('visitorTracked');
      if (!tracked) {
        api.post('/visitors/track').catch(() => {
          // Silently fail if tracking fails
        });
        sessionStorage.setItem('visitorTracked', 'true');
      }
    }
  }, [isAdminPage]);

  return (
    <div className="App min-h-screen flex flex-col">
      {!isAdminPage && <Navbar />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {!isAdminPage && <Footer />}
      {!isAdminPage && <WhatsAppButton />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
