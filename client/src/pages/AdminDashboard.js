import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import AdminProducts from './admin/AdminProducts';
import AdminQuotes from './admin/AdminQuotes';
import AdminUsers from './admin/AdminUsers';
import AdminStats from './admin/AdminStats';
import AdminContent from './admin/AdminContent';
import AdminServices from './admin/AdminServices';
import AdminCategories from './admin/AdminCategories';

const AdminDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  const menuItems = [
    { path: '/admin/dashboard', label: 'Dashboard', component: AdminStats },
    { path: '/admin/products', label: 'Products', component: AdminProducts },
    { path: '/admin/categories', label: 'Categories', component: AdminCategories },
    { path: '/admin/services', label: 'Services', component: AdminServices },
    { path: '/admin/quotes', label: 'Quote Requests', component: AdminQuotes },
    { path: '/admin/content', label: 'Content Management', component: AdminContent },
  ];

  if (user?.role === 'superadmin') {
    menuItems.push({ path: '/admin/users', label: 'Users', component: AdminUsers });
  }

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold font-dinbek text-reshow-dark">Admin Panel</h1>
          <div className="flex items-center gap-4">
            <span className="font-dosis text-gray-700">Welcome, {user?.fullName}</span>
            <button
              onClick={logout}
              className="bg-reshow-red text-white px-4 py-2 rounded-lg font-dosis font-semibold hover:bg-reshow-dark-red transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <nav className="bg-white rounded-lg shadow-sm p-4">
              <ul className="space-y-2">
                {menuItems.map(item => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`block px-4 py-2 rounded-lg font-dosis font-semibold transition-colors ${
                        location.pathname === item.path
                          ? 'bg-reshow-red text-white'
                          : 'text-reshow-dark hover:bg-gray-100'
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <Routes>
                <Route path="/dashboard" element={<AdminStats />} />
                <Route path="/products" element={<AdminProducts />} />
                <Route path="/categories" element={<AdminCategories />} />
                <Route path="/services" element={<AdminServices />} />
                <Route path="/quotes" element={<AdminQuotes />} />
                <Route path="/content" element={<AdminContent />} />
                {user?.role === 'superadmin' && (
                  <Route path="/users" element={<AdminUsers />} />
                )}
                {/* No auto-redirect - require explicit page selection */}
                <Route path="*" element={
                  <div className="text-center py-12">
                    <p className="text-gray-500 font-dosis text-lg">Please select a page from the sidebar to get started.</p>
                  </div>
                } />
              </Routes>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

