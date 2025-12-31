import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: ''
  });
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/users', formData);
      fetchUsers();
      setFormData({ fullName: '', email: '' });
      setShowForm(false);
      alert('User created successfully. Default password: 12345');
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to create user');
    }
  };

  const toggleUserStatus = async (userId, isActive) => {
    try {
      await api.put(`/admin/users/${userId}`, { isActive: !isActive });
      fetchUsers();
    } catch (error) {
      alert('Failed to update user status');
    }
  };

  const handleOpenPasswordModal = (user) => {
    setSelectedUser(user);
    setNewPassword('');
    setConfirmPassword('');
    setPasswordError('');
    setShowPasswordModal(true);
  };

  const handleClosePasswordModal = () => {
    setShowPasswordModal(false);
    setSelectedUser(null);
    setNewPassword('');
    setConfirmPassword('');
    setPasswordError('');
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError('');

    // Validate password strength
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      setPasswordError('Password must be at least 8 characters with uppercase, lowercase, number, and special character');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    try {
      await api.put(`/admin/users/${selectedUser.id}/password`, { newPassword });
      alert('Password changed successfully');
      handleClosePasswordModal();
      fetchUsers();
    } catch (error) {
      setPasswordError(error.response?.data?.error || 'Failed to change password');
    }
  };

  if (loading) {
    return <div className="text-center py-12 font-dosis">Loading users...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold font-dinbek text-reshow-dark">Users</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-reshow-red text-white px-4 py-2 rounded-lg font-dosis font-semibold hover:bg-reshow-dark-red transition-colors"
        >
          {showForm ? 'Cancel' : 'Create User'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg mb-6 space-y-4">
          <div>
            <label className="block font-dosis font-semibold mb-2">Full Name *</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-reshow-red font-dosis"
            />
          </div>
          <div>
            <label className="block font-dosis font-semibold mb-2">Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-reshow-red font-dosis"
            />
          </div>
          <button
            type="submit"
            className="bg-reshow-red text-white px-6 py-2 rounded-lg font-dosis font-semibold hover:bg-reshow-dark-red transition-colors"
          >
            Create User
          </button>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-3 text-left font-dinbek font-semibold">Name</th>
              <th className="border p-3 text-left font-dinbek font-semibold">Email</th>
              <th className="border p-3 text-left font-dinbek font-semibold">Role</th>
              <th className="border p-3 text-left font-dinbek font-semibold">Status</th>
              <th className="border p-3 text-left font-dinbek font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border">
                <td className="border p-3 font-dosis">{user.fullName}</td>
                <td className="border p-3 font-dosis">{user.email}</td>
                <td className="border p-3 font-dosis">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                    {user.role}
                  </span>
                </td>
                <td className="border p-3 font-dosis">
                  <span className={`px-2 py-1 rounded text-xs ${
                    user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {user.isActive ? 'Active' : 'Disabled'}
                  </span>
                </td>
                <td className="border p-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleUserStatus(user.id, user.isActive)}
                      className={`px-3 py-1 rounded text-sm font-dosis font-semibold ${
                        user.isActive
                          ? 'bg-red-500 text-white hover:bg-red-600'
                          : 'bg-green-500 text-white hover:bg-green-600'
                      }`}
                    >
                      {user.isActive ? 'Disable' : 'Enable'}
                    </button>
                    <button
                      onClick={() => handleOpenPasswordModal(user)}
                      className="px-3 py-1 rounded text-sm font-dosis font-semibold bg-blue-500 text-white hover:bg-blue-600"
                    >
                      Change Password
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold font-dinbek mb-4 text-reshow-dark">
              Change Password for {selectedUser.fullName}
            </h2>
            {passwordError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {passwordError}
              </div>
            )}
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block font-dosis font-semibold mb-2">New Password *</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-reshow-red font-dosis"
                />
                <p className="text-xs font-dosis text-gray-500 mt-1">
                  Min 8 chars, uppercase, lowercase, number, special character
                </p>
              </div>
              <div>
                <label className="block font-dosis font-semibold mb-2">Confirm New Password *</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-reshow-red font-dosis"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-reshow-red text-white py-3 rounded-lg font-dosis font-semibold hover:bg-reshow-dark-red transition-colors"
                >
                  Change Password
                </button>
                <button
                  type="button"
                  onClick={handleClosePasswordModal}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-dosis font-semibold hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;

