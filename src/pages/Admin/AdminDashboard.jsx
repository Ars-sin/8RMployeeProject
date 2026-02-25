import React, { useState, useEffect } from 'react';
import { Menu, Users, Archive, ClipboardList, Shield, LogOut, Plus, Trash2, Search, Filter, Download } from 'lucide-react';
import AdminArchived from './AdminArchived';
import AdminChangeLogs from './AdminChangeLogs';
import AddAdminModal from './AddAdminModal';
import { getAdmins, addAdmin, updateAdmin, archiveAdmin } from '../../services/adminService';
import editIcon from '../../Components/ui/edit.png';


const AdminDashboard = ({ onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentView, setCurrentView] = useState('admins'); // 'admins', 'archived', 'changelogs'
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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
    if (window.confirm('Are you sure you want to archive this admin?')) {
      try {
        await archiveAdmin(adminId);
        await loadAdmins();
        alert('Admin archived successfully!');
      } catch (error) {
        console.error('Error archiving admin:', error);
        alert('Failed to archive admin');
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

  // Pagination calculations
  const totalPages = Math.ceil(filteredAdmins.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedAdmins = filteredAdmins.slice(startIndex, endIndex);

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

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
            <p className="text-xs font-semibold text-gray-400 uppercase mb-3 mt-20Admin"></p>
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
          <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 px-8 py-5 flex-shrink-0">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Admins</h1>
                <div className="flex items-center gap-2 text-sm text-gray-500 mt-0.5">
                  <span>General</span>
                  <span>›</span>
                  <span className="text-blue-600">Admins</span>
                </div>
              </div>
            </header>

            {/* Content */}
            <main className="flex-1 flex flex-col overflow-hidden p-8">
              <div className="flex-1 flex flex-col bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {/* Toolbar */}
                <div className="p-6 border-b border-gray-200 flex-shrink-0">
                  <div className="flex items-center justify-between gap-4">
                    {/* Search */}
                    <div className="flex-1 max-w-md relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        placeholder="Search for id, name Customer"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3">
                      <button 
                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                      >
                        <Filter className="w-4 h-4" />
                        Filter
                      </button>
                      
                      <button 
                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                      >
                        <Download className="w-4 h-4" />
                        Export
                      </button>

                      <button
                        onClick={() => {
                          setEditingAdmin(null);
                          setShowAddAdminModal(true);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                      >
                        <Plus className="w-5 h-5" />
                        Add Admin
                      </button>
                    </div>
                  </div>
                </div>

                {/* Scrollable Table Container */}
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
                      <thead className="bg-white sticky top-0 z-10">
                        <tr className="border-b border-gray-200">
                          <th className="pl-8 pr-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                            ADMIN
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                            ID
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                            GMAIL
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                            POSITION
                          </th>
                          <th className="pl-6 pr-8 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                            ACTION
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedAdmins.map((admin) => (
                          <tr key={admin.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                            <td className="pl-8 pr-6 py-4">
                              <div className="text-sm text-gray-900">{admin.fullName}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-900">{admin.idNumber}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-900">{admin.email}</div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-sm text-gray-700">{admin.position}</span>
                            </td>
                            <td className="pl-6 pr-8 py-4">
                              <div className="flex items-center gap-3">
                                <button
                                  onClick={() => handleEditClick(admin)}
                                  className="p-1.5 hover:bg-blue-50 rounded transition-colors"
                                  title="Edit Admin"
                                >
                                  <img src={editIcon} alt="Edit" className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteAdmin(admin.id)}
                                  className="p-1.5 hover:bg-red-50 rounded transition-colors"
                                  title="Archive Admin"
                                >
                                  <Trash2 className="w-4 h-4 text-gray-500 hover:text-red-600" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>

                {/* Fixed Pagination at Bottom */}
                <div className="px-6 py-4 border-t border-gray-200 flex-shrink-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white">
                  <div className="text-sm text-gray-600">
                    {filteredAdmins.length > 0 ? (
                      <>
                        Showing {startIndex + 1} - {Math.min(endIndex, filteredAdmins.length)} of {filteredAdmins.length} admin{filteredAdmins.length !== 1 ? 's' : ''}
                      </>
                    ) : (
                      'No admins'
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Page</span>
                    <select 
                      value={currentPage}
                      onChange={(e) => setCurrentPage(Number(e.target.value))}
                      className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {Array.from({ length: totalPages || 1 }, (_, i) => i + 1).map(page => (
                        <option key={page} value={page}>{page}</option>
                      ))}
                    </select>
                    <span className="text-sm text-gray-600">of {totalPages || 1}</span>
                    
                    <button 
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      title="Previous page"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    
                    <button 
                      onClick={() => setCurrentPage(prev => Math.min(totalPages || 1, prev + 1))}
                      disabled={currentPage === (totalPages || 1)}
                      className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      title="Next page"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </main>
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
