import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

const AdminStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get('/admin/dashboard');
      setStats(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12 font-dosis">Loading...</div>;
  }

  if (!stats) {
    return <div className="text-center py-12 font-dosis text-red-500">Error loading statistics</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold font-dinbek mb-6 text-reshow-dark">Dashboard Overview</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="font-dosis font-semibold text-gray-600 mb-2">Total Visitors</h3>
          <p className="text-3xl font-bold font-dinbek text-reshow-red">{stats.totalVisitors || 0}</p>
        </div>
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="font-dosis font-semibold text-gray-600 mb-2">Total Products</h3>
          <p className="text-3xl font-bold font-dinbek text-reshow-dark">{stats.totalProducts}</p>
        </div>
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="font-dosis font-semibold text-gray-600 mb-2">Total Quotes</h3>
          <p className="text-3xl font-bold font-dinbek text-reshow-dark">{stats.totalQuotes}</p>
        </div>
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="font-dosis font-semibold text-gray-600 mb-2">Pending Quotes</h3>
          <p className="text-3xl font-bold font-dinbek text-reshow-red">{stats.pendingQuotes}</p>
        </div>
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="font-dosis font-semibold text-gray-600 mb-2">Total Users</h3>
          <p className="text-3xl font-bold font-dinbek text-reshow-dark">{stats.totalUsers}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminStats;

