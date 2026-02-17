import React, { useState } from 'react';
import { Search, Filter, Download, Menu, Edit2, Trash2 } from 'lucide-react';

const ArchivedPage = ({ onNavigate }) => {
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Sample archived employee data
  const [archivedEmployees, setArchivedEmployees] = useState([
    {
      id: 'EMP-2026-04719',
      name: 'Charles Ambrad',
      contact: 'Assistant@example.com',
      phone: '+62 819 1514 1435',
      position: 'Assistant',
      address: 'Unit 4B, Palm Crest Residences, 78 Lapu-Lapu Street, Barangay Lahug, Cebu City, 6000, Philippines'
    },
    {
      id: 'EMP-2026-04719',
      name: 'Horry Bella',
      contact: 'Assistant@example.com',
      phone: '+62 819 1514 1435',
      position: 'Assistant',
      address: 'Unit 4B, Palm Crest Residences, 78 Lapu-Lapu Street, Barangay Lahug, Cebu City, 6000, Philippines'
    },
    {
      id: 'EMP-2026-04719',
      name: 'Mary Caneda',
      contact: 'Assistant@example.com',
      phone: '+62 819 1514 1435',
      position: 'Assistant',
      address: 'Unit 4B, Palm Crest Residences, 78 Lapu-Lapu Street, Barangay Lahug, Cebu City, 6000, Philippines'
    },
    {
      id: 'EMP-2026-04719',
      name: 'Sean Jerez',
      contact: 'Assistant@example.com',
      phone: '+62 819 1514 1435',
      position: 'Assistant',
      address: 'Unit 4B, Palm Crest Residences, 78 Lapu-Lapu Street, Barangay Lahug, Cebu City, 6000, Philippines'
    },
    {
      id: 'EMP-2026-04719',
      name: 'Laurence Monaris',
      contact: 'Assistant@example.com',
      phone: '+62 819 1514 1435',
      position: 'Assistant',
      address: 'Unit 4B, Palm Crest Residences, 78 Lapu-Lapu Street, Barangay Lahug, Cebu City, 6000, Philippines'
    },
    {
      id: 'EMP-2026-04719',
      name: 'Charles Ambrad',
      contact: 'Assistant@example.com',
      phone: '+62 819 1514 1435',
      position: 'Assistant',
      address: 'Unit 4B, Palm Crest Residences, 78 Lapu-Lapu Street, Barangay Lahug, Cebu City, 6000, Philippines'
    },
    {
      id: 'EMP-2026-04719',
      name: 'Horry Bella',
      contact: 'Assistant@example.com',
      phone: '+62 819 1514 1435',
      position: 'Assistant',
      address: 'Unit 4B, Palm Crest Residences, 78 Lapu-Lapu Street, Barangay Lahug, Cebu City, 6000, Philippines'
    }
  ]);

  const handleSelectEmployee = (id) => {
    setSelectedEmployees(prev => 
      prev.includes(id) 
        ? prev.filter(empId => empId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedEmployees.length === archivedEmployees.length) {
      setSelectedEmployees([]);
    } else {
      setSelectedEmployees(archivedEmployees.map(emp => emp.id));
    }
  };

  const handleRestore = (id) => {
    if (window.confirm('Are you sure you want to restore this employee?')) {
      setArchivedEmployees(archivedEmployees.filter(emp => emp.id !== id));
      alert('Employee restored successfully!');
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to permanently delete this employee?')) {
      setArchivedEmployees(archivedEmployees.filter(emp => emp.id !== id));
    }
  };

  const handleExport = () => {
    alert('Exporting archived employee data...');
  };

  const filteredEmployees = archivedEmployees.filter(emp =>
    emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.contact.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = 13;

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-8 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => onNavigate && onNavigate('employees')}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Archived</h1>
              <div className="flex items-center gap-2 text-sm text-gray-500 mt-0.5">
                <span>General</span>
                <span>›</span>
                <span className="text-blue-600">Archived</span>
              </div>
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
                  placeholder="Search for id, open Consumer"
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

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-white">
                  <th className="px-6 py-4 text-left w-12">
                    <input
                      type="checkbox"
                      checked={selectedEmployees.length === archivedEmployees.length}
                      onChange={handleSelectAll}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    EMPLOYEE
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    CONTACT
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    POSITION
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    ADDRESS
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    ACTION
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((employee, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedEmployees.includes(employee.id)}
                        onChange={() => handleSelectEmployee(employee.id)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-semibold text-blue-600 mb-0.5">{employee.id}</div>
                        <div className="text-sm text-gray-900 font-medium">{employee.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm text-gray-900">{employee.contact}</div>
                        <div className="text-sm text-gray-500">{employee.phone}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-700">{employee.position}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600 leading-relaxed">{employee.address}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => handleRestore(employee.id)}
                          className="p-1.5 hover:bg-blue-50 rounded transition-colors"
                          title="Restore"
                        >
                          <svg className="w-4 h-4 text-gray-500 hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                        </button>
                        <button 
                          onClick={() => handleDelete(employee.id)}
                          className="p-1.5 hover:bg-red-50 rounded transition-colors"
                          title="Delete Permanently"
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
    </div>
  );
};

export default ArchivedPage;
