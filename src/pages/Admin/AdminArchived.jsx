import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, RotateCcw, Trash2 } from 'lucide-react';
import ConfirmationModal from '../../Components/ConfirmationModal';
import ViewAdminDetails from './ViewAdminDetails';
import { getAdmins, restoreAdmin, deleteAdmin } from '../../services/adminService';

const AdminArchived = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [archivedAdmins, setArchivedAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showViewAdminDetails, setShowViewAdminDetails] = useState(false);
  const [viewingAdmin, setViewingAdmin] = useState(null);

  // Confirmation modal states
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null,
    type: 'danger'
  });

  // Load archived admins from Firebase
  useEffect(() => {
    const loadArchivedAdmins = async () => {
      try {
        const allAdmins = await getAdmins(true); // Include archived
        const archived = allAdmins.filter(admin => admin.isArchived);
        setArchivedAdmins(archived);
      } catch (error) {
        console.error('Error loading archived admins:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadArchivedAdmins();
  }, []);

  const handleRestore = async (admin) => {
    setConfirmModal({
      isOpen: true,
      title: 'Restore Admin',
      message: `Are you sure you want to restore ${admin.fullName || 'this admin'}? They will be moved back to the active admins list.`,
      onConfirm: async () => {
        try {
          await restoreAdmin(admin.id);
          setArchivedAdmins(archivedAdmins.filter(a => a.id !== admin.id));
        } catch (error) {
          console.error('Error restoring admin:', error);
          alert('Failed to restore admin. Please try again.');
        }
      },
      type: 'info'
    });
  };

  const handlePermanentDelete = async (admin) => {
    setConfirmModal({
      isOpen: true,
      title: 'Permanently Delete Admin',
      message: `⚠️ WARNING: This will permanently delete ${admin.fullName || 'this admin'} from the database. This action cannot be undone. Are you sure?`,
      onConfirm: async () => {
        try {
          await deleteAdmin(admin.id);
          setArchivedAdmins(archivedAdmins.filter(a => a.id !== admin.id));
        } catch (error) {
          console.error('Error deleting admin:', error);
          alert('Failed to delete admin. Please try again.');
        }
      },
      type: 'danger'
    });
  };

  const handleViewAdminClick = (admin) => {
    setViewingAdmin(admin);
    setShowViewAdminDetails(true);
  };

  const handleExport = () => {
    alert('Exporting archived admin data...');
  };

  const filteredAdmins = archivedAdmins.filter(admin =>
    (admin.fullName?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (admin.idNumber?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (admin.email?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (admin.position?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredAdmins.length / 10);

  return (
    <>
      {/* Header */}
      <header className="bg-white border-b border-gray-200 flex-shrink-0">
        <div className="px-8 py-5">
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">Archived Admins</h1>
          <div className="mb-4">
            <span className="text-sm text-blue-600">Archived</span>
          </div>
          
          {/* Search and Actions */}
          <div className="flex items-center justify-between gap-4">
            {/* Search */}
            <div className="flex-1 max-w-md relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for id, name or email"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button 
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
              >
                <Filter className="w-4 h-4" />
                Filter
              </button>
              
              <button 
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 flex flex-col overflow-hidden p-8">
        <div className="flex-1 flex flex-col bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">

          {/* Scrollable Table Container */}
          <div className="flex-1 overflow-auto">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">Loading archived admins...</p>
              </div>
            ) : filteredAdmins.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">No archived admins found</p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-white sticky top-0 z-10">
                  <tr className="border-b border-gray-200">
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      ADMIN
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      EMAIL
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      POSITION
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      ACTION
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAdmins.map((admin, index) => (
                    <tr key={admin.id || index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleViewAdminClick(admin)}
                          className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors font-medium"
                        >
                          {admin.fullName || 'No Name'}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {admin.idNumber || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{admin.email || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-700">{admin.position || 'N/A'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => handleRestore(admin)}
                            className="p-1.5 hover:bg-green-50 rounded transition-colors"
                            title="Restore Admin"
                          >
                            <RotateCcw className="w-4 h-4 text-gray-500 hover:text-green-600" />
                          </button>
                          <button 
                            onClick={() => handlePermanentDelete(admin)}
                            className="p-1.5 hover:bg-red-50 rounded transition-colors"
                            title="Delete Permanently (Cannot be undone)"
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
              1 - {Math.min(10, filteredAdmins.length)} of {totalPages} Pages
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">This page on</span>
              <select className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>1</option>
                {totalPages > 1 && <option>2</option>}
                {totalPages > 2 && <option>3</option>}
              </select>
              <button 
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button 
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        type={confirmModal.type}
      />

      {/* View Admin Details Modal */}
      {showViewAdminDetails && viewingAdmin && (
        <ViewAdminDetails
          admin={viewingAdmin}
          onClose={() => {
            setShowViewAdminDetails(false);
            setViewingAdmin(null);
          }}
        />
      )}
    </>
  );
};

export default AdminArchived;
