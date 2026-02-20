import React, { useState, useEffect } from 'react';
import { Menu, Users, Archive, ClipboardList, Shield, LogOut, Plus, Edit2, Trash2, Search } from 'lucide-react';
import AdminArchived from './AdminArchived';
import AdminChangeLogs from './AdminChangeLogs';
import AddAdminModal from './AddAdminModal';
import { getAdmins, addAdmin, updateAdmin, deleteAdmin } from '../../services/adminService';


const AdminDashboard = ({ onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentView, setCurrentView] = useState('admins'); // 'admins', 'archived', 'changelogs'
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Load admins
  useEffect(() => {
    loadAdmins();
  }, []);

  const loadAdmins = async () => {
    try {
      setLoading(true);
      const data = await getAdmins();
      setAdmins(data);
    } catch (error) {
      console.error('Error loading admins:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAdmin = async (formData) => {
    try {
      await addAdmin(formData);
      await loadAdmins();
      setShowAddAdminModal(false);
      alert('Admin added successfully!');
    } catch (error) {
      console.error('Error adding admin:', error);
      alert('Failed to add admin');
    }
  };

  const handleEditAdmin = async (formData) => {
    try {
      await updateAdmin(editingAdmin.id, formData);
      await loadAdmins();
      setEditingAdmin(null);
      setShowAddAdminModal(false);
      alert('Admin updated successfully!');
    } catch (error) {
      console.error('Error updating admin:', error);
      alert('Failed to update admin');
    }
  };

  const handleDeleteAdmin = async (adminId) => {
    if (window.confirm('Are you sure you want to delete this admin?')) {
      try {
        await deleteAdmin(adminId);
        await loadAdmins();
        alert('Admin deleted successfully!');
      } catch (error) {
        console.error('Error deleting admin:', error);
        alert('Failed to delete admin');
      }
    }
  };

  const handleEditClick = (admin) => {
    setEditingAdmin(admin);
    setShowAddAdminModal(true);
  };

  const filteredAdmins = admins.filter(admin => 
    admin.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.idNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.position?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`bg-white transition-all duration-300 relative ${sidebarOpen ? 'w-64' : 'w-0'} overflow-hidden flex flex-col`}>
        <div className="p-6 pb-24 flex-1">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-white border-2 border-gray-200 rounded-lg flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M5 17 L5 10 L10 5 L15 10 L15 17" stroke="#666" strokeWidth="1.5" fill="none"/>
                <rect x="7.5" y="12.5" width="5" height="4.5" fill="#666"/>
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold">
                <span className="text-green-600">8</span>
                <span className="text-gray-800">RM</span>
              </h1>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase mb-3">Settings</p>
            <nav className="space-y-1">
              <button 
                onClick={() => setCurrentView('admins')}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium ${
                  currentView === 'admins' 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Shield className="w-5 h-5" />
                Admins
              </button>
              
              <button 
                onClick={() => setCurrentView('archived')}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium ${
                  currentView === 'archived' 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Archive className="w-5 h-5" />
                Archived
              </button>
              
              <button 
                onClick={() => setCurrentView('changelogs')}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium ${
                  currentView === 'changelogs' 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <ClipboardList className="w-5 h-5" />
                Change Logs
              </button>
            </nav>
          </div>
        </div>

        {/* Logout Button */}
        <div className="p-6">
          <button 
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden ml-1">
        {currentView === 'archived' ? (
          <AdminArchived />
        ) : currentView === 'changelogs' ? (
          <AdminChangeLogs />
        ) : (
          // Admin List View
          <div className="flex-1 flex flex-col bg-white">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Admin Management</h2>
                <button
                  onClick={() => {
                    setEditingAdmin(null);
                    setShowAddAdminModal(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Add Admin
                </button>
              </div>
              
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for id, name Customer"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Admin Table */}
            <div className="flex-1 overflow-auto">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">Loading admins...</p>
                </div>
              ) : filteredAdmins.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">No admins found</p>
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <input type="checkbox" className="rounded" />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Admin
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Gmail
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Position
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredAdmins.map((admin) => (
                      <tr key={admin.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input type="checkbox" className="rounded" />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {admin.fullName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                          {admin.idNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {admin.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {admin.position}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleEditClick(admin)}
                            className="text-blue-600 hover:text-blue-900 mr-4"
                          >
                            <Edit2 className="w-4 h-4 inline" />
                          </button>
                          <button
                            onClick={() => handleDeleteAdmin(admin.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="w-4 h-4 inline" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Admin Modal */}
      {showAddAdminModal && (
        <AddAdminModal
          admin={editingAdmin}
          onClose={() => {
            setShowAddAdminModal(false);
            setEditingAdmin(null);
          }}
          onSave={editingAdmin ? handleEditAdmin : handleAddAdmin}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
