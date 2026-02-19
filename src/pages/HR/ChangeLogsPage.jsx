import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, RefreshCw, Menu } from 'lucide-react';
import { getChangeLogs, formatLogTimestamp } from '../../services/changeLogService';

const ChangeLogsPage = ({ onNavigate }) => {
  const [selectedLogs, setSelectedLogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [changeLogs, setChangeLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');

  // Load change logs from Firebase
  useEffect(() => {
    loadChangeLogs();
  }, []);

  const loadChangeLogs = async () => {
    try {
      setLoading(true);
      const logs = await getChangeLogs(200); // Get last 200 logs
      setChangeLogs(logs);
    } catch (error) {
      console.error('Error loading change logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActionColor = (type) => {
    switch (type) {
      case 'employee_added':
        return 'text-green-600 bg-green-50';
      case 'employee_updated':
        return 'text-blue-600 bg-blue-50';
      case 'employee_archived':
        return 'text-orange-600 bg-orange-50';
      case 'employee_restored':
        return 'text-purple-600 bg-purple-50';
      case 'employee_deleted':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getActionIcon = (type) => {
    switch (type) {
      case 'employee_added':
        return '➕';
      case 'employee_updated':
        return '✏️';
      case 'employee_archived':
        return '📦';
      case 'employee_restored':
        return '↩️';
      case 'employee_deleted':
        return '🗑️';
      default:
        return '📝';
    }
  };

  const handleSelectLog = (id) => {
    setSelectedLogs(prev => 
      prev.includes(id) 
        ? prev.filter(logId => logId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedLogs.length === changeLogs.length) {
      setSelectedLogs([]);
    } else {
      setSelectedLogs(changeLogs.map(log => log.id));
    }
  };

  const handleExport = () => {
    alert('Exporting change logs data...');
  };

  const filteredLogs = changeLogs.filter(log => {
    const matchesSearch = 
      (log.employeeName?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (log.description?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (log.performedBy?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (log.action?.toLowerCase() || '').includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterType === 'all' || log.type === filterType;
    
    return matchesSearch && matchesFilter;
  });

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
              <h1 className="text-2xl font-semibold text-gray-900">Change Logs</h1>
              <div className="flex items-center gap-2 text-sm text-gray-500 mt-0.5">
                <span>General</span>
                <span>›</span>
                <span className="text-blue-600">Change Logs</span>
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
                  placeholder="Search for id, name Customer"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Actions</option>
                  <option value="employee_added">Added</option>
                  <option value="employee_updated">Updated</option>
                  <option value="employee_archived">Archived</option>
                  <option value="employee_restored">Restored</option>
                  <option value="employee_deleted">Deleted</option>
                </select>
                
                <button 
                  onClick={loadChangeLogs}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                  disabled={loading}
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
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
                      checked={selectedLogs.length === changeLogs.length}
                      onChange={handleSelectAll}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    USER
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    ACTION TYPE
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    TIMESTAMP
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    DESCRIPTION
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                      Loading change logs...
                    </td>
                  </tr>
                ) : filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                      No change logs found
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log, index) => (
                    <tr key={log.id || index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedLogs.includes(log.id)}
                          onChange={() => handleSelectLog(log.id)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          {/*<div className="text-sm font-semibold text-blue-600 mb-0.5">
                            {log.employeeId || 'N/A'}
                          </div>*/}
                          <div className="text-sm text-gray-900 font-medium">
                            {log.employeeName || 'System'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getActionColor(log.type)}`}>
                            {getActionIcon(log.type)} {log.action}
                          </span>
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          By: {log.performedBy}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {formatLogTimestamp(log.timestamp)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600 leading-relaxed">{log.description}</span>
                      </td>
                    </tr>
                  ))
                )}
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

export default ChangeLogsPage;
