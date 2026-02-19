import React, { useState } from 'react';
import { Search, Filter, ChevronDown } from 'lucide-react';

const AdminChangeLogs = () => {
  const [selectedLogs, setSelectedLogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const [changeLogs, setChangeLogs] = useState([
    {
      id: 1,
      adminId: 'EMP-2026-04719',
      accountId: 'ACCOUNT 10',
      user: 'Admin Changes',
      actionType: 'Account Information',
      timestamp: '8:30pm',
      date: '09/02/2026',
      description: 'Changes in contact details (phone number and address) 09923456789 to 09109876543Z1'
    },
    {
      id: 2,
      adminId: 'EMP-2026-04719',
      accountId: 'ACCOUNT 10',
      user: 'Admin Changes',
      actionType: 'Account Information',
      timestamp: '8:30pm',
      date: '09/02/2026',
      description: 'Changes in contact details (phone number and address) 09923456789 to 09109876543Z1'
    },
    {
      id: 3,
      adminId: 'EMP-2026-04719',
      accountId: 'ACCOUNT 10',
      user: 'Admin Changes',
      actionType: 'Account Information',
      timestamp: '8:30pm',
      date: '09/02/2026',
      description: 'Changes in contact details (phone number and address) 09923456789 to 09109876543Z1'
    },
    {
      id: 4,
      adminId: 'EMP-2026-04719',
      accountId: 'ACCOUNT 10',
      user: 'Admin Changes',
      actionType: 'Account Information',
      timestamp: '8:30pm',
      date: '09/02/2026',
      description: 'Changes in contact details (phone number and address) 09923456789 to 09109876543Z1'
    },
    {
      id: 5,
      adminId: 'EMP-2026-04719',
      accountId: 'ACCOUNT 10',
      user: 'Admin Changes',
      actionType: 'Account Information',
      timestamp: '8:30pm',
      date: '09/02/2026',
      description: 'Changes in contact details (phone number and address) 09923456789 to 09109876543Z1'
    },
    {
      id: 6,
      adminId: 'EMP-2026-04719',
      accountId: 'ACCOUNT 10',
      user: 'Admin Changes',
      actionType: 'Account Information',
      timestamp: '8:30pm',
      date: '09/02/2026',
      description: 'Changes in contact details (phone number and address) 09923456789 to 09109876543Z1'
    },
    {
      id: 7,
      adminId: 'EMP-2026-04719',
      accountId: 'ACCOUNT 10',
      user: 'Admin Changes',
      actionType: 'Account Information',
      timestamp: '8:30pm',
      date: '09/02/2026',
      description: 'Changes in contact details (phone number and address) 09923456789 to 09109876543Z1'
    }
  ]);

  const handleSelectAll = () => {
    if (selectedLogs.length === changeLogs.length) {
      setSelectedLogs([]);
    } else {
      setSelectedLogs(changeLogs.map(log => log.id));
    }
  };

  const handleSelect = (id) => {
    setSelectedLogs(prev => 
      prev.includes(id) 
        ? prev.filter(logId => logId !== id)
        : [...prev, id]
    );
  };

  const filteredLogs = changeLogs.filter(log =>
    log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.adminId.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">ACCOUNT ID</th>
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
                        <div className="text-sm font-semibold text-blue-600 mb-0.5">{log.adminId}</div>
                        <div className="text-sm text-gray-900 font-medium">{log.accountId}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm text-gray-900 font-medium">{log.user}</div>
                        <div className="text-sm text-gray-600">{log.actionType}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm text-gray-900">{log.timestamp}</div>
                        <div className="text-sm text-gray-500">{log.date}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">{log.description}</span>
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

export default AdminChangeLogs;
