import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, Menu, RotateCcw, Trash2 } from 'lucide-react';
import { getEmployees, restoreEmployee, deleteEmployee } from '../../services/employeeService';

const ArchivedPage = ({ onNavigate }) => {
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [archivedEmployees, setArchivedEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load archived employees from Firebase
  useEffect(() => {
    const loadArchivedEmployees = async () => {
      try {
        const allEmployees = await getEmployees(true); // Include archived
        const archived = allEmployees.filter(emp => emp.isArchived);
        setArchivedEmployees(archived);
      } catch (error) {
        console.error('Error loading archived employees:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadArchivedEmployees();
  }, []);

  const handleRestore = async (id) => {
    if (window.confirm('Are you sure you want to restore this employee?')) {
      try {
        await restoreEmployee(id);
        setArchivedEmployees(archivedEmployees.filter(emp => emp.id !== id));
        alert('Employee restored successfully');
      } catch (error) {
        console.error('Error restoring employee:', error);
        alert('Failed to restore employee. Please try again.');
      }
    }
  };

  const handlePermanentDelete = async (id) => {
    if (window.confirm('⚠️ WARNING: This will permanently delete the employee from the database. This action cannot be undone. Are you sure?')) {
      try {
        await deleteEmployee(id);
        setArchivedEmployees(archivedEmployees.filter(emp => emp.id !== id));
        alert('Employee permanently deleted');
      } catch (error) {
        console.error('Error deleting employee:', error);
        alert('Failed to delete employee. Please try again.');
      }
    }
  };

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

  const handleExport = () => {
    alert('Exporting archived employee data...');
  };

  const filteredEmployees = archivedEmployees.filter(emp =>
    (emp.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (emp.fullName?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (emp.id?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (emp.employmentId?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (emp.contact?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (emp.email?.toLowerCase() || '').includes(searchQuery.toLowerCase())
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
                  <tr key={employee.id || index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
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
                        {/*<div className="text-sm font-semibold text-blue-600 mb-0.5">
                          {employee.employmentId || 'N/A'}
                        </div>
                        */}
                        <div className="text-sm text-gray-900 font-medium">
                          {employee.fullName || employee.name || 'No Name'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm text-gray-900">{employee.email || 'N/A'}</div>
                        <div className="text-sm text-gray-500">{employee.contact || 'N/A'}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-700">{employee.position || 'N/A'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600 leading-relaxed">{employee.address}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => handleRestore(employee.id)}
                          className="p-1.5 hover:bg-green-50 rounded transition-colors"
                          title="Restore Employee"
                        >
                          <RotateCcw className="w-4 h-4 text-gray-500 hover:text-green-600" />
                        </button>
                        <button 
                          onClick={() => handlePermanentDelete(employee.id)}
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
