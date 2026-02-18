import React, { useState } from 'react';
import { Search, Plus, Edit2, Trash2, ChevronDown } from 'lucide-react';
import AddAdminModal from './AddAdminModal';
import EditAdminModal from './EditAdminModal';

const AdminDashboard = ({ onNavigate }) => {
  const [selectedAdmins, setSelectedAdmins] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);

  // Sample admin data
  const [admins, setAdmins] = useState([
    {
      id: 1,
      adminId: 'EMP-2026-04719',
      name: 'Charles Ambrad',
      email: 'goodmorning@gmail.com',
      role: 'HR Manager',
      position: 'HR Manager',
      actions: true
    },
    {
      id: 2,
      adminId: 'EMP-2026-04719',
      name: 'Charles Ambrad',
      email: 'goodmorning@gmail.com',
      role: 'HR Manager',
      position: 'HR Manager',
      actions: true
    },
    {
      id: 3,
      adminId: 'EMP-2026-04719',
      name: 'Charles Ambrad',
      email: 'goodmorning@gmail.com',
      role: 'HR Manager',
      position: 'HR Manager',
      actions: true
    },
    {
      id: 4,
      adminId: 'EMP-2026-04719',
      name: 'Charles Ambrad',
      email: 'goodmorning@gmail.com',
      role: 'HR Manager',
      position: 'HR Manager',
      actions: true
    },
    {
      id: 5,
      adminId: 'EMP-2026-04719',
      name: 'Charles Ambrad',
      email: 'goodmorning@gmail.com',
      role: 'HR Manager',
      position: 'HR Manager',
      actions: true
    },
    {
      id: 6,
      adminId: 'EMP-2026-04719',
      name: 'Charles Ambrad',
      email: 'goodmorning@gmail.com',
      role: 'HR Manager',
      position: 'HR Manager',
      actions: true
    },
    {
      id: 7,
      adminId: 'EMP-2026-04719',
      name: 'Charles Ambrad',
      email: 'goodmorning@gmail.com',
      role: 'HR Manager',
      position: 'HR Manager',
      actions: true
    }
  ]);

  const handleSelectAdmin = (id) => {
    setSelectedAdmins(prev => 
      prev.includes(id) 
        ? prev.filter(adminId => adminId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedAdmins.length === admins.length) {
      setSelectedAdmins([]);
    } else {
      setSelectedAdmins(admins.map(admin => admin.id));
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this admin?')) {
      setAdmins(admins.filter(admin => admin.id !== id));
    }
  };

  const handleAddAdmin = () => {
    setShowAddAdmin(true);
  };

  const handleNameClick = (admin) => {
    setSelectedAdmin(admin);
  };

  const filteredAdmins = admins.filter(admin =>
    admin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    admin.adminId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    admin.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = 3;

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-8 py-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Admins</h1>
            <div className="flex items-center gap-2 text-sm text-gray-500 mt-0.5">
              <span>Settings</span>
              <span>›</span>
              <span className="text-blue-600">Admin</span>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-auto p-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Toolbar */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between gap-4">
              {/* Search */}
              <div className="flex-1 max-w-md relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by id, name or email"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    className="appearance-none px-4 py-2 pr-10 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  >
                    <option value="All">Filter</option>
                    <option value="HR Manager">HR Manager</option>
                    <option value="Admin">Admin</option>
                    <option value="Manager">Manager</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                </div>
                
                <div className="relative">
                  <select className="appearance-none px-4 py-2 pr-10 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
                    <option>Open 3</option>
                    <option>Option 1</option>
                    <option>Option 2</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                </div>
                
                <button 
                  onClick={handleAddAdmin}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Add Admin
                </button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-white">
                  <th className="px-6 py-4 text-left w-12">
                    <input
                      type="checkbox"
                      checked={selectedAdmins.length === admins.length}
                      onChange={handleSelectAll}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    ADMIN
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    EMAIL
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    ROLE
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    POSITION
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredAdmins.map((admin) => (
                  <tr key={admin.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedAdmins.includes(admin.id)}
                        onChange={() => handleSelectAdmin(admin.id)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-semibold text-blue-600 mb-0.5">{admin.adminId}</div>
                        <button 
                          onClick={() => handleNameClick(admin)}
                          className="text-sm text-gray-900 font-medium hover:text-blue-600 transition-colors text-left"
                        >
                          {admin.name}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-900">{admin.email}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-700">{admin.role}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-700">{admin.position}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => handleNameClick(admin)}
                          className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                        >
                          <Edit2 className="w-4 h-4 text-gray-500" />
                        </button>
                        <button 
                          onClick={() => handleDelete(admin.id)}
                          className="p-1.5 hover:bg-red-50 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-gray-500 hover:text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              1 - 10 of {totalPages} Pages
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">This page on</span>
              <select className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>1</option>
                <option>2</option>
                <option>3</option>
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

      {/* Add/Edit Admin Modals */}
      {showAddAdmin && (
        <AddAdminModal
          onClose={() => setShowAddAdmin(false)}
          onSave={(data) => {
            console.log('New admin:', data);
            setShowAddAdmin(false);
          }}
        />
      )}

      {selectedAdmin && (
        <EditAdminModal
          admin={selectedAdmin}
          onClose={() => setSelectedAdmin(null)}
          onSave={(data) => {
            console.log('Updated admin:', data);
            setSelectedAdmin(null);
          }}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
