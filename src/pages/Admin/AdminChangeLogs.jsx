import React, { useState, useEffect } from 'react';
import { Search, Filter, ChevronDown, RefreshCw } from 'lucide-react';
import { getChangeLogs, formatLogTimestamp } from '../../services/changeLogService';

const AdminChangeLogs = () => {
  const [selectedLogs, setSelectedLogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [changeLogs, setChangeLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    loadChangeLogs();
  }, []);

  const loadChangeLogs = async () => {
    try {
      setLoading(true);
      const logs = await getChangeLogs();
      // Filter only admin-related logs
      const adminLogs = logs.filter(log => 
        log.type?.includes('admin_') || 
        log.action === 'admin' ||
        log.description?.toLowerCase().includes('admin')
      );
      setChangeLogs(adminLogs);
    } catch (error) {
      console.error('Error loading change logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = () => {
    if (selectedLogs.length === filteredLogs.length) {
      setSelectedLogs([]);
    } else {
      setSelectedLogs(filteredLogs.map(log => log.id));
    }
  };

  const handleSelect = (id) => {
    setSelectedLogs(prev => 
      prev.includes(id) 
        ? prev.filter(logId => logId !== id)
        : [...prev, id]
    );
  };

  const getActionBadgeColor = (type) => {
    if (type?.includes('added')) return 'bg-green-100 text-green-800';
    if (type?.includes('updated')) return 'bg-blue-100 text-blue-800';
    if (type?.includes('deleted')) return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getActionLabel = (type) => {
    if (type?.includes('added')) return 'Added';
    if (type?.includes('updated')) return 'Updated';
    if (type?.includes('deleted')) return 'Deleted';
    return type || 'Action';
  };

  const filteredLogs = changeLogs.filter(log => {
    const matchesSearch = 
      log.employeeName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.employeeId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.performedBy?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = filterType === 'all' || log.type === filterType;

    return matchesSearch && matchesFilter;
  });

  return (
    <>
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-8 py-5">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Change Logs</h1>
          <div className="flex items-center gap-2 text-sm text-gray-500 mt-0.5">
            <span>Settings</span>
            <span>›</span>
            <span className="text-blue-600">Change Logs</span>
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
                <button
                  onClick={loadChangeLogs}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                >
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </button>

                <div className="relative">
                  <select 
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="appearance-none px-4 py-2 pr-10 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Actions</option>
                    <option value="admin_added">Added</option>
                    <option value="admin_updated">Updated</option>
                    <option value="admin_deleted">Deleted</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <p className="text-gray-500">Loading change logs...</p>
              </div>
            ) : filteredLogs.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <p className="text-gray-500">No admin change logs found</p>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-white">
                    <th className="px-6 py-4 text-left w-12">
                      <input
                        type="checkbox"
                        checked={selectedLogs.length === filteredLogs.length && filteredLogs.length > 0}
                        onChange={handleSelectAll}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">ADMIN NAME</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">ACTION TYPE</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">TIMESTAMP</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">DESCRIPTION</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedLogs.includes(log.id)}
                          onChange={() => handleSelect(log.id)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-semibold text-gray-900 mb-0.5">{log.employeeName || 'Unknown'}</div>
                          <div className="text-sm text-gray-500">{log.details?.email || ''}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getActionBadgeColor(log.type)}`}>
                            {getActionLabel(log.type)}
                          </span>
                          <div className="text-sm text-gray-600 mt-1">{log.details?.position || ''}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{formatLogTimestamp(log.timestamp)}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">{log.description}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {filteredLogs.length} admin change log{filteredLogs.length !== 1 ? 's' : ''}
            </div>
            <div className="text-sm text-gray-500">
              {selectedLogs.length > 0 && `${selectedLogs.length} selected`}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default AdminChangeLogs;
