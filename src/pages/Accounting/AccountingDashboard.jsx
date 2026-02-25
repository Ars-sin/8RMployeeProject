import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, FileText, CreditCard, LogOut, Briefcase, Archive, ClipboardList, Search } from 'lucide-react';
import AccountingArchived from './AccountingArchived';
import AccountingChangeLogs from './AccountingChangeLogs';
import { getProjects } from '../../services/projectService';

const AccountingDashboard = ({ user, onLogout }) => {
  const [currentView, setCurrentView] = useState('projects'); // 'projects', 'archived', 'changelogs'
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await getProjects();
      setProjects(data);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = projects.filter(proj => 
    proj.projectName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    proj.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    proj.status?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination for Projects
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProjects = filteredProjects.slice(startIndex, endIndex);

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'in progress':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'on hold':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'planning':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="bg-white w-64 flex flex-col border-r border-gray-200">
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

          {/* User Info */}
          <div className="mb-6 p-3 bg-blue-50 rounded-lg">
            <p className="text-xs text-gray-500">Logged in as</p>
            <p className="text-sm font-semibold text-gray-900">{user?.fullName || 'Accounting User'}</p>
            <p className="text-xs text-gray-600">{user?.position || 'Accounting Department'}</p>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase mb-3 mt-20"></p>
            <nav className="space-y-1">
              <button 
                onClick={() => setCurrentView('projects')}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium ${
                  currentView === 'projects' 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Briefcase className="w-5 h-5" />
                Projects
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
          <AccountingArchived projects={projects} />
        ) : currentView === 'changelogs' ? (
          <AccountingChangeLogs />
        ) : (
          // Projects List View
          <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 px-8 py-5 flex-shrink-0">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">Projects</h2>
                <div className="flex items-center gap-2 text-sm text-gray-500 mt-0.5">
                  <span>Accounting Management</span>
                  <span>›</span>
                  <span className="text-blue-600">Projects</span>
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
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search projects..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Scrollable Table Container */}
                <div className="flex-1 overflow-auto">
                  {loading ? (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-gray-500">Loading projects...</p>
                    </div>
                  ) : filteredProjects.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-gray-500">No projects found</p>
                    </div>
                  ) : (
                    <table className="w-full">
                      <thead className="bg-white sticky top-0 z-10">
                        <tr className="border-b border-gray-200">
                          <th className="pl-8 pr-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                            PROJECT NAME
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                            LOCATION
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                            START DATE
                          </th>
                          <th className="pl-6 pr-8 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                            STATUS
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedProjects.map((project) => (
                          <tr key={project.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                            <td className="pl-8 pr-6 py-4">
                              <div className="text-sm text-gray-900">{project.projectName}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-500">{project.location}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-500">{project.startDate}</div>
                            </td>
                            <td className="pl-6 pr-8 py-4">
                              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(project.status)}`}>
                                {project.status}
                              </span>
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
                    {filteredProjects.length > 0 ? (
                      <>
                        Showing {startIndex + 1} - {Math.min(endIndex, filteredProjects.length)} of {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''}
                      </>
                    ) : (
                      'No projects'
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
    </div>
  );
};

export default AccountingDashboard;
