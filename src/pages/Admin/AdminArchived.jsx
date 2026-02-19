import React, { useState } from 'react';
import { Search, Filter, Plus, Edit2, Trash2, ChevronDown } from 'lucide-react';

const AdminArchived = () => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const [archivedAdmins, setArchivedAdmins] = useState([
    {
      id: 1,
      adminId: 'EMP-2026-04719',
      name: 'Charles Ambrad',
      email: 'goodmorning@gmail.com',
      position: 'HR Manager'
    },
    {
      id: 2,
      adminId: 'EMP-2026-04719',
      name: 'Charles Ambrad',
      email: 'goodmorning@gmail.com',
      position: 'HR Manager'
    },
    {
      id: 3,
      adminId: 'EMP-2026-04719',
      name: 'Charles Ambrad',
      email: 'goodmorning@gmail.com',
      position: 'HR Manager'
    },
    {
      id: 4,
      adminId: 'EMP-2026-04719',
      name: 'Charles Ambrad',
      email: 'goodmorning@gmail.com',
      position: 'HR Manager'
    },
    {
      id: 5,
      adminId: 'EMP-2026-04719',
      name: 'Charles Ambrad',
      email: 'goodmorning@gmail.com',
      position: 'HR Manager'
    },
    {
      id: 6,
      adminId: 'EMP-2026-04719',
      name: 'Charles Ambrad',
      email: 'goodmorning@gmail.com',
      position: 'HR Manager'
    },
    {
      id: 7,
      adminId: 'EMP-2026-04719',
      name: 'Charles Ambrad',
      email: 'goodmorning@gmail.com',
      position: 'HR Manager'
    }
  ]);

  const handleSelectAll = () => {
    if (selectedItems.length === archivedAdmins.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(archivedAdmins.map(admin => admin.id));
    }
  };

  const handleSelect = (id) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    );
  };

  const filteredAdmins = archivedAdmins.filter(admin =>
    admin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    admin.adminId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    admin.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-8 py-5">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Archived</h1>
          <div className="flex items-center gap-2 text-sm text-gray-500 mt-0.5">
            <span>Settings</span>
            <span>›</span>
            <span className="text-blue-600">Archived</span>
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
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <select className="appearance-none px-4 py-2 pr-10 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Filter</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                </div>
                
                <div className="relative">
                  <select className="appearance-none px-4 py-2 pr-10 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Open 3</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                </div>
                
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
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
                      checked={selectedItems.length === archivedAdmins.length}
                      onChange={handleSelectAll}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">ADMIN</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">ID</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">EMAIL</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">POSITION</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">ACTION</th>
                </tr>
              </thead>
              <tbody>
                {filteredAdmins.map((admin) => (
                  <tr key={admin.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(admin.id)}
                        onChange={() => handleSelect(admin.id)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-900 font-medium">{admin.name}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-blue-600 font-semibold">{admin.adminId}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-900">{admin.email}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-700">{admin.position}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <button className="p-1.5 hover:bg-gray-100 rounded">
                          <Edit2 className="w-4 h-4 text-gray-500" />
                        </button>
                        <button className="p-1.5 hover:bg-red-50 rounded">
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
            <div className="text-sm text-gray-600">1 - 10 of 3 Pages</div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">This page on</span>
              <select className="px-3 py-1 border border-gray-300 rounded-lg text-sm">
                <option>1</option>
              </select>
              <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default AdminArchived;
